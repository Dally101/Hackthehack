import json
import os
from dotenv import load_dotenv
from hackathon_datasets_bundle.examples.generate_emails import send_email
from datetime import datetime, timedelta

TASK_TRACKER_FILE = "task_tracker.json"

# Load environment variables from .env file
load_dotenv()

def load_tasks():
    """Load tasks from the JSON file."""
    with open(TASK_TRACKER_FILE, "r") as file:
        return json.load(file)

def save_tasks(tasks):
    """Save tasks to the JSON file."""
    with open(TASK_TRACKER_FILE, "w") as file:
        json.dump(tasks, file, indent=4)

def add_task(task, owner, due_date):
    """Add a new task to the tracker."""
    tasks = load_tasks()
    new_task = {
        "Task": task,
        "Owner": owner,
        "Status": "Pending",
        "Due": due_date
    }
    tasks.append(new_task)
    save_tasks(tasks)
    print(f"Task '{task}' added successfully.")

def update_task_status(task_name, new_status):
    """Update the status of an existing task."""
    tasks = load_tasks()
    for task in tasks:
        if task["Task"] == task_name:
            task["Status"] = new_status
            task["LastUpdated"] = datetime.now().isoformat()
            save_tasks(tasks)
            print(f"Task '{task_name}' updated to status: {new_status}")
            return
    print(f"Task '{task_name}' not found.")

def delete_task(task_name):
    """Delete a task from the tracker."""
    tasks = load_tasks()
    tasks = [task for task in tasks if task["Task"] != task_name]
    save_tasks(tasks)
    print(f"Task '{task_name}' deleted successfully.")

def list_tasks():
    """List all tasks."""
    tasks = load_tasks()
    for task in tasks:
        print(f"Task: {task['Task']}, Owner: {task['Owner']}, Status: {task['Status']}, Due: {task['Due']}")

def send_task_reminders():
    """Send reminders for tasks that are due soon or pending."""
    with open(TASK_TRACKER_FILE, "r") as file:
        tasks = json.load(file)

    today = datetime.now()
    for task in tasks:
        due_date = datetime.strptime(task["Due"], "%Y-%m-%d")
        if task["Status"] == "Pending" and (due_date - today).days <= 1:
            # Generate reminder email
            email_body = f"Hello {task['Owner']},\n\nThis is a reminder that the task '{task['Task']}' is due on {task['Due']}. Please ensure it is completed on time.\n\nThank you!"

            # Send the email to the task owner's email
            send_email(
                subject=f"Reminder: Task '{task['Task']}' Due Soon",
                body=email_body,
                recipient_email=task["Email"]  # Use the task owner's email
            )

# Example usage
if __name__ == "__main__":
    print("Task Tracker Options:")
    print("1. Add Task")
    print("2. Update Task Status")
    print("3. Delete Task")
    print("4. List Tasks")
    print("5. Send Task Reminders")
    choice = input("Enter your choice: ")

    if choice == "1":
        task = input("Enter task name: ")
        owner = input("Enter owner: ")
        due_date = input("Enter due date (YYYY-MM-DD): ")
        add_task(task, owner, due_date)
    elif choice == "2":
        task_name = input("Enter task name to update: ")
        new_status = input("Enter new status (Pending/In Progress/Completed): ")
        update_task_status(task_name, new_status)
    elif choice == "3":
        task_name = input("Enter task name to delete: ")
        delete_task(task_name)
    elif choice == "4":
        list_tasks()
    elif choice == "5":
        send_task_reminders()
    else:
        print("Invalid choice.")