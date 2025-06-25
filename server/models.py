from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-contacts.user',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)  
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    contacts = db.relationship('Contact', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.username} ({self.email})>'

    def to_dict(self):
        return {
        "id": self.id,
        "username": self.username,
        "email": self.email,
        "role": self.role
    }


class Contact(db.Model, SerializerMixin):
    __tablename__ = 'contacts'
    serialize_rules = ('-user.contacts', '-lead.contact', '-tasks.contact', '-activity_logs.contact')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    user = db.relationship('User', back_populates='contacts')
    lead = db.relationship('Lead', uselist=False, back_populates='contact', cascade='all, delete-orphan')
    tasks = db.relationship('Task', back_populates='contact', cascade='all, delete-orphan')
    activity_logs = db.relationship('ActivityLog', back_populates='contact', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Contact {self.name} ({self.email})>"

class Lead(db.Model, SerializerMixin):
    __tablename__ = 'leads'
    serialize_rules = ('-contact.lead',)

    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    contact = db.relationship('Contact', back_populates='lead')

    def __repr__(self):
        return f"<Lead ContactID={self.contact_id} Status={self.status}>"

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    serialize_rules = ('-contact.tasks',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    contact = db.relationship('Contact', back_populates='tasks')

    def __repr__(self):
        return f"<Task {self.title} - Status: {self.status}, Completed: {self.completed}>"

class ActivityLog(db.Model, SerializerMixin):
    __tablename__ = 'activity_logs'
    serialize_rules = ('-contact.activity_logs',)

    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    interaction_type = db.Column(db.String, nullable=False)  
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    contact = db.relationship('Contact', back_populates='activity_logs')

    def __repr__(self):
        return f"<ActivityLog ContactID={self.contact_id} Type={self.interaction_type}>"
