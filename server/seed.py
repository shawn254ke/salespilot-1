from app import app
from models import db, User, Contact, Lead, Task, ActivityLog
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

with app.app_context():
    print("Deleting old data...")
    ActivityLog.query.delete()
    Task.query.delete()
    Lead.query.delete()
    Contact.query.delete()
    User.query.delete()

    print("Creating users...")
    user1 = User(
        username="admin",
        email="admin@gmail.com",
        password_hash=generate_password_hash("admin123"),
        role="admin"
    )
    user2 = User(
        username="sales_rep_jane",
        email="jane@gmail.com",
        password_hash=generate_password_hash("jane123"),
        role="sales_rep"
    )
    db.session.add_all([user1, user2])
    db.session.commit()

    print("Creating contacts...")
    contact1 = Contact(
        name="Samuel Kiptoo",
        email="samuelkip@gmail.com",
        phone="0712345678",
        company="TechCorp",
        user_id=user2.id
    )
    contact2 = Contact(
        name="Faith Akinyi",
        email="faithakinyi@gmail.com",
        phone="0723456789",
        company="BizGroup",
        user_id=user2.id
    )
    db.session.add_all([contact1, contact2])
    db.session.commit()

    print("Creating leads...")
    lead1 = Lead(contact_id=contact1.id, status="New")
    lead2 = Lead(contact_id=contact2.id, status="In Progress")
    db.session.add_all([lead1, lead2])
    db.session.commit()

    print("Creating tasks...")
    task1 = Task(
        title="Follow up with Samuel",
        description="Discuss proposal",
        due_date=datetime.now() + timedelta(days=3),
        status="Pending",
        contact_id=contact1.id
    )
    task2 = Task(
        title="Send contract to Faith",
        description="Email contract draft",
        due_date=datetime.now() + timedelta(days=1),
        status="In Progress",
        contact_id=contact2.id
    )
    db.session.add_all([task1, task2])
    db.session.commit()

    print("Creating activity logs...")
    log1 = ActivityLog(
        contact_id=contact1.id,
        interaction_type="Email",
        notes="Sent introductory email.",
        created_at=datetime.now()
    )
    log2 = ActivityLog(
        contact_id=contact2.id,
        interaction_type="Call",
        notes="Spoke with client regarding project timeline.",
        created_at=datetime.now()
    )
    db.session.add_all([log1, log2])
    db.session.commit()

    print("Seeding done!")
