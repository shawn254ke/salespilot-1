from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__= 'users'
    
    pass

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    pass

class Lead(db.Model):
    __tablename__ = 'leads'
    
    pass

class Task(db.Model):
    __tablename__ = 'tasks'
    
    pass

class Activity_log(db.Model):
    __tablename__ = 'activity_logs'
    
    pass

