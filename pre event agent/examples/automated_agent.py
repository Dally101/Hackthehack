import time
import json
from datetime import datetime
from openai_agents_tools import TaskManagementAgent
from generate_emails import EmailManagementAgent
from announcement_agent import AnnouncementAgent
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Initialize agents
print(f"Using TaskManagementAgent from: {TaskManagementAgent.__module__}")
task_agent = TaskManagementAgent("../task_tracker.json")
email_agent = EmailManagementAgent("../participants.json", "../email_snippets.json")
announcement_agent = AnnouncementAgent("../new_events.json", "../announcements.html")

class EventFileHandler(FileSystemEventHandler):
    def __init__(self, announcement_agent, task_agent):
        self.announcement_agent = announcement_agent
        self.task_agent = task_agent

    def on_modified(self, event):
        if event.src_path.endswith("new_events.json"):
            print("Detected change in new_events.json. Updating website...")
            self.announcement_agent.update_website()

class TaskFileHandler(FileSystemEventHandler):
    def __init__(self, task_agent):
        self.task_agent = task_agent
        self.previous_tasks = self.load_previous_tasks()
        self.last_modified_time = 0  # To debounce file changes

    def load_previous_tasks(self):
        try:
            with open(self.task_agent.task_file, 'r') as file:
                return json.load(file)
        except Exception as e:
            print(f"Error loading previous tasks: {e}")
            return []

    def on_modified(self, event):
        if event.src_path.endswith("task_tracker.json"):
            current_time = time.time()
            # Debounce: Ignore changes within 1 second of the last modification
            if current_time - self.last_modified_time < 1:
                return

            self.last_modified_time = current_time
            print("Detected change in task_tracker.json. Checking for new tasks...")
            self.check_for_new_tasks()

    def check_for_new_tasks(self):
        try:
            print("Loading current tasks from task_tracker.json...")
            with open(self.task_agent.task_file, 'r') as file:
                current_tasks = json.load(file)

            print("Comparing with previous tasks...")
            new_tasks = [task for task in current_tasks if task not in self.previous_tasks]
            print(f"New tasks identified: {new_tasks}")

            for task in new_tasks:
                print(f"Checking if task '{task['Task']}' is due...")
                if task.get("Notified", False):
                    print(f"Task '{task['Task']}' has already been notified. Skipping.")
                    continue

                if self.task_agent.is_due(task):
                    print(f"Task '{task['Task']}' is due. Attempting to send email...")
                    self.task_agent.send_reminder(task)
                    task["Notified"] = True  # Mark task as notified
                else:
                    print(f"Task '{task['Task']}' is not due today.")

            # Save updated tasks back to the file
            with open(self.task_agent.task_file, 'w') as file:
                json.dump(current_tasks, file, indent=4)

            self.previous_tasks = current_tasks
        except Exception as e:
            print(f"Error checking for new tasks: {e}")

def run_agents():
    print("Running automated agents...")

    # Task Management: Send reminders for approaching deadlines
    print("Checking for tasks with approaching deadlines...")
    task_agent.send_reminders()

    # Email Outreach: Send personalized emails to participants
    print("Sending personalized outreach emails...")
    email_agent.send_emails()

    # Announcements: Update website with new events
    print("Updating website with new announcements...")
    announcement_agent.update_website()

if __name__ == "__main__":
    print("Starting automated agent system...")

    # Initial update for announcements
    announcement_agent.update_website()

    # Set up file watcher for new_events.json and task_tracker.json
    event_handler = EventFileHandler(announcement_agent, task_agent)
    task_event_handler = TaskFileHandler(task_agent)
    observer = Observer()
    observer.schedule(event_handler, path="..", recursive=False)
    observer.schedule(task_event_handler, path="..", recursive=False)
    observer.start()

    try:
        while True:
            run_agents()
            print("Waiting for the next cycle (30 minutes)...")
            time.sleep(1800)  # Wait for 30 minutes before running again
    except KeyboardInterrupt:
        observer.stop()
    observer.join()