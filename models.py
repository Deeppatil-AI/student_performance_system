from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, date

db = SQLAlchemy()

class Branch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)          # e.g. "AIML"
    full_name = db.Column(db.String(200), nullable=True)     # e.g. "Artificial Intelligence & Machine Learning"
    year = db.Column(db.String(50), nullable=True)           # e.g. "SY BTech"
    # Relationships
    timetable_slots = db.relationship('TimetableSlot', backref='branch', lazy=True)
    users = db.relationship('User', backref='branch', lazy=True)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    full_name = db.Column(db.String(200), nullable=True)
    roll_no = db.Column(db.String(50), nullable=True)
    prn = db.Column(db.String(50), nullable=True)
    photo = db.Column(db.String(300), nullable=True)  # filename of uploaded photo
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    section = db.Column(db.String(5), nullable=True)  # S1, S2, S3
    # Relationships
    lecture_attendances = db.relationship('LectureAttendance', backref='student', lazy=True)
    todos = db.relationship('Todo', backref='student', lazy=True)
    coding_stats = db.relationship('CodingStat', backref='student', lazy=True)

class TimetableSlot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)
    day = db.Column(db.String(10), nullable=False)           # Monday, Tuesday, etc.
    slot_number = db.Column(db.Integer, nullable=False)      # 1-7
    start_time = db.Column(db.String(10), nullable=False)    # "09:20"
    end_time = db.Column(db.String(10), nullable=False)      # "10:10"
    subject_name = db.Column(db.String(50), nullable=False)  # PSI, DAA, AI, etc.
    subject_type = db.Column(db.String(5), nullable=False)   # TH or PR
    section = db.Column(db.String(5), nullable=True)         # S1, S2, S3 or null (all)
    professor = db.Column(db.String(100), nullable=True)

class LectureAttendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today)
    timetable_slot_id = db.Column(db.Integer, db.ForeignKey('timetable_slot.id'), nullable=False)
    status = db.Column(db.String(10), nullable=False)  # 'present' or 'absent'
    # Relationships
    timetable_slot = db.relationship('TimetableSlot', backref='attendances', lazy=True)
    # Unique constraint: one record per user per date per slot
    __table_args__ = (db.UniqueConstraint('user_id', 'date', 'timetable_slot_id', name='unique_attendance'),)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task = db.Column(db.String(250), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(50)) # daily, weekly, monthly

class CodingStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(100), nullable=False)
    problems_solved = db.Column(db.Integer, default=0)
    rating = db.Column(db.Integer, default=0)
