import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "nayakamicheal@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # You need to set this
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "nayakamicheal@gmail.com")

async def send_contact_email(name: str, email: str, subject: str, message: str):
    """Send contact form email to admin"""
    
    if not SMTP_PASSWORD:
        print("⚠️ SMTP_PASSWORD not set. Email will not be sent.")
        print(f"📧 Would send: From: {email}, To: {ADMIN_EMAIL}")
        print(f"📧 Message: {message}")
        return False
    
    try:
        # Create email
        msg = MIMEMultipart()
        msg['From'] = email
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"📧 Contact Form: {subject if subject else 'New Message'}"
        
        # Email body
        body = f"""
        📧 New Contact Form Message
        
        ──────────────────────────────
        Name:    {name}
        Email:   {email}
        Subject: {subject if subject else 'No subject'}
        ──────────────────────────────
        
        Message:
        {message}
        
        ──────────────────────────────
        Sent from SQL Query Agent
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(email, ADMIN_EMAIL, msg.as_string())
        server.quit()
        
        print(f"✅ Email sent to {ADMIN_EMAIL} from {email}")
        return True
        
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        return False