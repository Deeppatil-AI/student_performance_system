from mongoengine import Document, StringField, IntField, ReferenceField, DateTimeField, BooleanField, CASCADE
from flask_login import UserMixin
from datetime import datetime, date

class Branch(Document):
    name = StringField(max_length=50, required=True)
    full_name = StringField(max_length=200)
    year = StringField(max_length=50)

    def __unicode__(self):
        return self.name

class User(Document, UserMixin):
    username = StringField(max_length=150, unique=True, required=True)
    password = StringField(max_length=150, required=True)
    full_name = StringField(max_length=200)
    roll_no = StringField(max_length=50)
    prn = StringField(max_length=50)
    email = StringField(max_length=200)
    photo = StringField(max_length=300)
    branch = ReferenceField(Branch)
    section = StringField(max_length=5)
    
    def get_id(self):
        return str(self.id)

class TimetableSlot(Document):
    branch = ReferenceField(Branch, required=True)
    day = StringField(max_length=10, required=True)
    slot_number = IntField(required=True)
    start_time = StringField(max_length=10, required=True)
    end_time = StringField(max_length=10, required=True)
    subject_name = StringField(max_length=50, required=True)
    subject_type = StringField(max_length=5, required=True)
    section = StringField(max_length=5)
    professor = StringField(max_length=100)

class LectureAttendance(Document):
    student = ReferenceField(User, required=True)
    date = DateTimeField(default=date.today, required=True)
    timetable_slot = ReferenceField(TimetableSlot, required=True)
    status = StringField(max_length=10, required=True)
    
    meta = {
        'indexes': [
            {'fields': ('student', 'date', 'timetable_slot'), 'unique': True}
        ]
    }

class Todo(Document):
    student = ReferenceField(User, required=True)
    task = StringField(max_length=250, required=True)
    completed = BooleanField(default=False)
    date_added = DateTimeField(default=datetime.utcnow)
    type = StringField(max_length=50)

class CodingStat(Document):
    student = ReferenceField(User, required=True)
    platform = StringField(max_length=100, required=True)
    problems_solved = IntField(default=0)
    rating = IntField(default=0)
