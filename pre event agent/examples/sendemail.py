import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load participant data
with open('participants.json', 'r') as f:
    participants = json.load(f)

# Email account credentials
GMAIL_USER="chintuds1997@gmail.com"
GMAIL_PASS="kmxoaxfzxeuiplxo"

# SMTP server details
smtp_server = "smtp.gmail.com"
smtp_port = 587

# Email subject
subject = "Event Participation Details"

# Set up the SMTP server
server = smtplib.SMTP(smtp_server, smtp_port)
server.starttls()
server.login(GMAIL_USER, GMAIL_PASS)

# Send email to each participant

for participant in participants:
    receiver_email = participant['Email']
    receiver_name = participant['Name']
    
    # Create the email
    message = MIMEMultipart()
    message['From'] = GMAIL_USER
    message['To'] = receiver_email
    message['Subject'] = subject
    
    # Customize the email body
    body = f"""Dear {receiver_name},

Thank you for registering for our event! Here are your details:
- Role: {participant['Role']}
- Skills: {participant['Skills']}
- Availability: {participant['Availability']}
- Diet Preference: {participant['Diet']}
- Pronouns: {participant['Pronouns']}

We are excited to have you with us!

Best regards,
Event Team
"""
    
    message.attach(MIMEText(body, 'plain'))
    
    # Send the email
    try:
        server.sendmail(GMAIL_USER, receiver_email, message.as_string())
        print(f"✅ Email sent to {receiver_name} ({receiver_email})")
    except Exception as e:
        print(f"❌ Failed to send email to {receiver_email}: {e}")

# Quit the SMTP server
server.quit()
