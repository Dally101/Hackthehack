import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

class AnnouncementAgent:
    def __init__(self, events_file, output_file):
        self.events_file = events_file
        self.output_file = output_file

    def load_events(self):
        with open(self.events_file, "r") as file:
            return json.load(file)["Events"]

    def generate_html(self, events):
        html_content = """<!DOCTYPE html>
<html>
<head>
    <title>Announcements</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #000;
            color: #FFD700;
        }
        header {
            background-color: #FFD700;
            color: #000;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        .event {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #FFD700;
            border-radius: 5px;
            background-color: #222;
        }
        .event h2 {
            margin: 0;
            color: #FFD700;
        }
        .event p {
            margin: 5px 0;
        }
        footer {
            text-align: center;
            padding: 10px;
            background-color: #FFD700;
            color: #000;
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>
<body>
    <header>
        <h1>Upcoming Events</h1>
    </header>
    <div class=\"container\">
"""
        for event in events:
            html_content += f"""
        <div class='event'>
            <h2>{event['Event']}</h2>
            <p><strong>Date:</strong> {event['Date']}</p>
            <p><strong>Time:</strong> {event['Time']}</p>
            <p><strong>Location:</strong> {event['Location']}</p>
        </div>
"""
        html_content += """
    </div>
    <footer>
        <p>&copy; 2025 Hackathon Announcements</p>
    </footer>
</body>
</html>"""
        return html_content

    def update_website(self):
        events = self.load_events()
        html_content = self.generate_html(events)
        with open(self.output_file, "w") as file:
            file.write(html_content)
        print(f"Website updated with {len(events)} events.")

class EventFileHandler(FileSystemEventHandler):
    def __init__(self, agent):
        self.agent = agent

    def on_modified(self, event):
        if event.src_path.endswith("new_events.json"):
            print("Detected change in new_events.json. Updating website...")
            self.agent.update_website()

# Example usage
if __name__ == "__main__":
    agent = AnnouncementAgent("../new_events.json", "../announcements.html")

    # Initial update
    agent.update_website()

    # Set up file watcher
    event_handler = EventFileHandler(agent)
    observer = Observer()
    observer.schedule(event_handler, path="..", recursive=False)
    observer.start()

    print("Watching for changes in new_events.json...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()