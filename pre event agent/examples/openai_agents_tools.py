import asyncio
import logging
import os
import random
import json
from datetime import datetime
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from generate_emails import send_email

import azure.identity
import openai
from agents import Agent, OpenAIChatCompletionsModel, Runner, function_tool, set_tracing_disabled
from dotenv import load_dotenv
from rich.logging import RichHandler

# Setup logging with rich
logging.basicConfig(level=logging.WARNING, format="%(message)s", datefmt="[%X]", handlers=[RichHandler()])
logger = logging.getLogger("weekend_planner")

# Disable tracing since we're not connected to a supported tracing provider
set_tracing_disabled(disabled=True)

# Setup the OpenAI client to use either Azure OpenAI or GitHub Models
load_dotenv(override=True)
API_HOST = os.getenv("API_HOST", "github")
if API_HOST == "github":
    client = openai.AsyncOpenAI(base_url="https://models.inference.ai.azure.com", api_key=os.environ["GITHUB_TOKEN"])
    MODEL_NAME = os.getenv("GITHUB_MODEL", "gpt-4o")
elif API_HOST == "azure":
    token_provider = azure.identity.get_bearer_token_provider(azure.identity.DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")
    client = openai.AsyncAzureOpenAI(
        api_version=os.environ["AZURE_OPENAI_VERSION"],
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        azure_ad_token_provider=token_provider,
    )
    MODEL_NAME = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]


@function_tool
def get_weather(city: str) -> str:
    logger.info(f"Getting weather for {city}")
    if random.random() < 0.05:
        return {
            "city": city,
            "temperature": 72,
            "description": "Sunny",
        }
    else:
        return {
            "city": city,
            "temperature": 60,
            "description": "Rainy",
        }


@function_tool
def get_activities(city: str, date: str) -> list:
    logger.info(f"Getting activities for {city} on {date}")
    return [
        {"name": "Hiking", "location": city},
        {"name": "Beach", "location": city},
        {"name": "Museum", "location": city},
    ]


@function_tool
def get_current_date() -> str:
    """Gets the current date and returns as a string in format YYYY-MM-DD."""
    logger.info("Getting current date")
    return datetime.now().strftime("%Y-%m-%d")


agent = Agent(
    name="Weekend Planner",
    instructions="You help users plan their weekends and choose the best activities for the given weather. If an activity would be unpleasant in the weather, don't suggest it. Include the date of the weekend in your response.",
    tools=[get_weather, get_activities, get_current_date],
    model=OpenAIChatCompletionsModel(model=MODEL_NAME, openai_client=client),
)


TASK_TRACKER_FILE = "../task_tracker.json"
NEW_EVENTS_FILE = "../new_events.json"

def load_events():
    with open(NEW_EVENTS_FILE, "r") as file:
        return json.load(file)

def post_announcements():
    """Post announcements for events from new_events.json."""
    events = load_events()["Events"]

    for event in events:
        # Generate announcement content
        announcement = (
            f"Event: {event['Event']}\n"
            f"Date: {event['Date']}\n"
            f"Time: {event['Time']}\n"
            f"Location: {event['Location']}\n"
        )

        print("Posting Announcement:")
        print(announcement)


class TaskManagementAgent:
    def __init__(self, task_file):
        self.task_file = task_file

    def load_tasks(self):
        with open(self.task_file, "r") as file:
            return json.load(file)

    def save_tasks(self, tasks):
        with open(self.task_file, "w") as file:
            json.dump(tasks, file, indent=4)

    def add_task(self, task, owner, due_date, email):
        tasks = self.load_tasks()
        new_task = {
            "Task": task,
            "Owner": owner,
            "Email": email,
            "Status": "Pending",
            "Due": due_date
        }
        tasks.append(new_task)
        self.save_tasks(tasks)
        print(f"Task '{task}' added successfully.")

    def list_tasks(self, status=None):
        tasks = self.load_tasks()
        if status:
            tasks = [task for task in tasks if task["Status"].lower() == status.lower()]
        for task in tasks:
            print(f"Task: {task['Task']}, Owner: {task['Owner']}, Status: {task['Status']}, Due: {task['Due']}")

    def update_task_status(self, task_name, new_status):
        tasks = self.load_tasks()
        for task in tasks:
            if task["Task"] == task_name:
                task["Status"] = new_status
                self.save_tasks(tasks)
                print(f"Task '{task_name}' updated to status: {new_status}")
                return
        print(f"Task '{task_name}' not found.")

    def send_reminders(self):
        today = datetime.now()
        tasks = self.load_tasks()
        for task in tasks:
            if task.get("Notified", False):
                print(f"Skipping task '{task['Task']}' as a reminder has already been sent.")
                continue

            due_date = datetime.strptime(task["Due"], "%Y-%m-%d")
            if task["Status"] == "Pending" and (due_date - today).days <= 1:
                print(f"Reminder: Task '{task['Task']}' is due on {task['Due']}.")
                recipient_email = task.get("Email", None)
                if not recipient_email:
                    print(f"Skipping task '{task['Task']}' as no email is provided for the owner.")
                    continue

                email_body = f"Hello,\n\nThis is a reminder that the task '{task['Task']}' is due on {task['Due']}. Please ensure it is completed on time.\n\nThank you."
                try:
                    print(f"Sending email to {recipient_email} for task '{task['Task']}'...")
                    send_email(
                        subject=f"Reminder: Task '{task['Task']}' Due Soon",
                        body=email_body,
                        recipient_email=recipient_email
                    )
                    print(f"Email successfully sent to {recipient_email} for task '{task['Task']}'.")
                    task["Notified"] = True  # Mark task as notified
                except Exception as e:
                    print(f"Failed to send email to {recipient_email} for task '{task['Task']}': {e}")

        self.save_tasks(tasks)

    def send_reminder(self, task):
        """Send an email reminder for a specific task."""
        recipient_email = task.get("Email")
        if not recipient_email:
            print(f"No email provided for task '{task['Task']}'. Skipping reminder.")
            return

        email_body = (
            f"Hello {task['Owner']},\n\n"
            f"This is a reminder that the task '{task['Task']}' is due on {task['Due']}.\n"
            f"Please ensure it is completed on time.\n\nThank you."
        )

        try:
            print(f"Sending email to {recipient_email} for task '{task['Task']}'...")
            send_email(
                subject=f"Reminder: Task '{task['Task']}' Due Soon",
                body=email_body,
                recipient_email=recipient_email
            )
            print(f"Email successfully sent to {recipient_email} for task '{task['Task']}'.")
        except Exception as e:
            print(f"Failed to send email to {recipient_email} for task '{task['Task']}': {e}")

    def is_due(self, task):
        """Check if a task is due today or earlier."""
        try:
            due_date = datetime.strptime(task['Due'], '%Y-%m-%d').date()
            return due_date <= datetime.now().date()
        except Exception as e:
            print(f"Error parsing due date for task '{task['Task']}': {e}")
            return False


# Example usage
if __name__ == "__main__":
    task_agent = TaskManagementAgent("../task_tracker.json")

    print("Task Management Options:")
    print("1. Add Task")
    print("2. List Tasks")
    print("3. Update Task Status")
    print("4. Send Reminders")
    print("5. Post Announcements")
    choice = input("Enter your choice: ")

    if choice == "1":
        task = input("Enter task name: ")
        owner = input("Enter owner: ")
        due_date = input("Enter due date (YYYY-MM-DD): ")
        email = input("Enter email: ")
        task_agent.add_task(task, owner, due_date, email)
    elif choice == "2":
        status = input("Enter status to filter by (or press Enter to list all): ")
        task_agent.list_tasks(status)
    elif choice == "3":
        task_name = input("Enter task name to update: ")
        new_status = input("Enter new status (Pending/In Progress/Completed): ")
        task_agent.update_task_status(task_name, new_status)
    elif choice == "4":
        task_agent.send_reminders()
    elif choice == "5":
        post_announcements()
    else:
        print("Invalid choice.")
