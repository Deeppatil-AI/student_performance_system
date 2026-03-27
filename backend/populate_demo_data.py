import os
from datetime import datetime, date, timedelta
import random
from mongoengine import connect
from models import User, Branch, TimetableSlot, LectureAttendance, Todo, CodingStat
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

load_dotenv()
connect(host=os.getenv('MONGO_URI'))

def populate():
    user = User.objects(username='Rahul').first()
    if not user:
        print("User Rahul not found, creating...")
        user = User(
            username='Rahul',
            password=generate_password_hash('password123'),
            full_name='Rahul Sharma'
        ).save()
    else:
        user.password = generate_password_hash('password123')
        user.save()

    # 1. Profile Details
    user.full_name = "Rahul Sharma"
    user.email = "rahul.sharma@rcpit.com"
    user.roll_no = "22IT105"
    user.prn = "PRN20220105"
    branch = Branch.objects.first()
    user.branch = branch
    user.section = "S1"
    user.save()
    print(f"Updated Rahul's profile with branch: {branch.name if branch else 'None'}")

    # 2. Todo Items
    Todo.objects(student=user).delete()
    tasks = [
        ("Complete OS Assignment", "Academic"),
        ("Prepare for Tech Quiz", "Academic"),
        ("Buy new notebook", "Personal"),
        ("Practice LeetCode", "Coding"),
        ("Gym workout", "Personal")
    ]
    for task_text, task_type in tasks:
        Todo(student=user, task=task_text, type=task_type, completed=random.choice([True, False])).save()
    print("Added tasks")

    # 3. Coding Stats
    CodingStat.objects(student=user).delete()
    platforms = [
        ("LeetCode", 45, 1205),
        ("HackerRank", 128, 1550),
        ("CodeChef", 22, 1420)
    ]
    for p, solved, rating in platforms:
        CodingStat(student=user, platform=p, problems_solved=solved, rating=rating).save()
    print("Added coding stats")

    # 4. Attendance
    if branch:
        slots = TimetableSlot.objects(branch=branch)
        if slots:
            today = date.today()
            # Clear existing attendance for Rahul to start fresh
            LectureAttendance.objects(student=user).delete()
            
            for i in range(14): # Last 14 days
                d = today - timedelta(days=i)
                # Skip future or way back if needed, but here we just go back 14 days
                day_name = d.strftime('%A')
                # Filter slots for this user's section
                day_slots = [s for s in slots if s.day == day_name and (not s.section or s.section == user.section)]
                for s in day_slots:
                    status = 'present' if random.random() > 0.15 else 'absent'
                    dt = datetime.combine(d, datetime.min.time())
                    LectureAttendance(student=user, date=dt, timetable_slot=s, status=status).save()
            print("Populated attendance for the last 14 days")
        else:
            print("No timetable slots found for branch")
    else:
        print("No branch found to populate attendance")

    print("\nDemo data population for 'Rahul' complete!")

if __name__ == "__main__":
    populate()
