import json
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
import csv

# Load environment variables from .env file
load_dotenv()

EMAIL_SNIPPETS_FILE = "email_snippets.json"

def generate_email(template_subject, **kwargs):
    """Generate a personalized email from a template."""
    with open(EMAIL_SNIPPETS_FILE, "r") as file:
        templates = json.load(file)

    for template in templates:
        if template["Subject"] == template_subject:
            return template["Body"].format(**kwargs)

    raise ValueError(f"Template with subject '{template_subject}' not found.")

def send_email(subject, body, recipient_email):
    """Send an email using SMTP."""
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    if not sender_email or not sender_password:
        raise ValueError("Email credentials are not set in the .env file.")

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = recipient_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:  # Replace with your SMTP server
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

class EmailManagementAgent:
    def __init__(self, participants_file, templates_file):
        self.participants_file = participants_file
        self.templates_file = templates_file

    def load_participants(self):
        with open(self.participants_file, "r") as file:
            return json.load(file)

    def load_templates(self):
        with open(self.templates_file, "r") as file:
            return json.load(file)

    def draft_email(self, participant, template):
        return template["Body"].format(
            name=participant["Name"],
            event="Hackathon 2025",
            date="April 27, 2025"
        )

    def send_emails(self):
        participants = self.load_participants()
        templates = self.load_templates()

        for participant in participants:
            if participant.get("Contacted", False):
                print(f"Skipping participant {participant['Name']} as they have already been contacted.")
                continue

            role = participant.get("Role", "student").lower()
            if role == "student":
                template = next((t for t in templates if t["Subject"] == "Welcome to the Hackathon!"), None)
            elif role == "faculty":
                template = next((t for t in templates if t["Subject"] == "Faculty Invitation to Hackathon"), None)
            else:
                print(f"Unknown role for participant {participant['Name']}, skipping.")
                continue

            if template:
                email_body = self.draft_email(participant, template)
                try:
                    print(f"Sending email to {participant['Email']}...")
                    send_email(
                        subject=template["Subject"],
                        body=email_body,
                        recipient_email=participant["Email"]
                    )
                    print(f"Email successfully sent to {participant['Email']}.")
                    participant["Contacted"] = True  # Mark participant as contacted
                except Exception as e:
                    print(f"Failed to send email to {participant['Email']}: {e}")

        with open(self.participants_file, "w") as file:
            json.dump(participants, file, indent=4)

# Example usage
if __name__ == "__main__":
    agent = EmailManagementAgent("../participants.json", "../email_snippets.json")
    agent.send_emails()