"""
Seed script to populate timetable data for multiple branches logic updated for MongoDB.
Run once: python seed_timetable.py
"""
import os
from dotenv import load_dotenv

# Load env before importing app
load_dotenv()

from app import app
from models import Branch, TimetableSlot

# Teaching Staff mapping
PROFESSORS = {
    'PSI': 'Prof. A.B.Patil',
    'AI': 'Prof. Tushant Tayade',
    'DAA': 'Prof. K.S.Patil',
    'DBMS': 'Prof. Vashisth Katre',
    'OE': 'Prof. N.A. Patil',
    'UHV': 'Prof. P.K. Patil',
    'DTL': 'Prof. N.A. Patil',
    'PL-II': 'Prof. S.L.Tambe',
}

PR_PROFESSORS = {
    'AI': {
        'S1': 'Prof. N.G.Shinde',
        'S2': 'Prof. N.G.Shinde',
        'S3': 'Dr. S.P.Patil',
    },
    'DAA': 'Prof. K.S.Patil',
    'DBMS': 'Prof. P.V. Baviskar',
    'DTL': 'Prof. N.A. Patil',
    'PL-II': 'Prof. S.L.Tambe',
}

def get_professor(subject, stype='TH', section=None):
    if stype == 'PR' and subject in PR_PROFESSORS:
        prof = PR_PROFESSORS[subject]
        if isinstance(prof, dict):
            return prof.get(section, list(prof.values())[0])
        return prof
    return PROFESSORS.get(subject, '')

TIMETABLE_AIML = []

def add_slot(slot, start, end, day, subject, stype='TH', section=None):
    TIMETABLE_AIML.append((slot, start, end, day, subject, stype, section))

# Slots (Simplified for brevity)
for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday']:
    add_slot(1, '09:20', '10:10', day, 'PSI')
add_slot(1, '09:20', '10:10', 'Friday', 'UHV')
add_slot(1, '09:20', '10:10', 'Saturday', 'Sem Project')

for day in ['Monday', 'Tuesday', 'Wednesday']:
    add_slot(2, '10:10', '11:00', day, 'DAA')
add_slot(2, '10:10', '11:00', 'Thursday', 'AI')
add_slot(2, '10:10', '11:00', 'Friday', 'Library Hour')
add_slot(2, '10:10', '11:00', 'Saturday', 'UHV')

for day in ['Monday', 'Tuesday', 'Wednesday']:
    add_slot(3, '11:50', '12:40', day, 'AI')
add_slot(3, '11:50', '12:40', 'Thursday', 'PL-II', 'PR', 'S1')
add_slot(3, '11:50', '12:40', 'Thursday', 'AI', 'PR', 'S2')
add_slot(3, '11:50', '12:40', 'Thursday', 'DAA', 'PR', 'S3')
add_slot(3, '11:50', '12:40', 'Friday', 'DBMS')
add_slot(3, '11:50', '12:40', 'Saturday', 'Sem Project')

for day in ['Monday', 'Tuesday']:
    add_slot(4, '12:40', '13:30', day, 'DBMS')
add_slot(4, '12:40', '13:30', 'Wednesday', 'DAA')
add_slot(4, '12:40', '13:30', 'Thursday', 'PL-II', 'PR', 'S1')
add_slot(4, '12:40', '13:30', 'Thursday', 'AI', 'PR', 'S2')
add_slot(4, '12:40', '13:30', 'Thursday', 'DAA', 'PR', 'S3')
add_slot(4, '12:40', '13:30', 'Friday', 'UHV')
add_slot(4, '12:40', '13:30', 'Saturday', 'DBMS')

# Slots 5 & 6 (Practicals)
for day, sub_pr in [('Monday', [('DTL','S1'), ('DAA','S2'), ('AI','S3')]),
                   ('Tuesday', [('DBMS','S1'), ('DTL','S2'), ('PL-II','S3')]),
                   ('Friday', [('DAA','S1'), ('DBMS','S2'), ('DTL','S3')]),
                   ('Saturday', [('AI','S1'), ('PL-II','S2'), ('DBMS','S3')])]:
    for sub, sec in sub_pr:
        add_slot(5, '13:45', '14:35', day, sub, 'PR', sec)
        add_slot(6, '14:35', '15:25', day, sub, 'PR', sec)

for day in ['Wednesday', 'Thursday']:
    add_slot(5, '13:45', '14:35', day, 'OE')
    add_slot(6, '14:35', '15:25', day, 'OE')

def seed():
    with app.app_context():
        print("Cleaning old data...")
        TimetableSlot.objects().delete()
        Branch.objects().delete()

        branches = [
            Branch(name='AIML', full_name='Artificial Intelligence & Machine Learning', year='SY BTech').save(),
            Branch(name='AIDS', full_name='Artificial Intelligence & Data Science', year='SY BTech').save(),
            Branch(name='IT', full_name='Information Technology', year='SY BTech').save()
        ]

        subject_map_by_branch = {
            'AIDS': {'PSI': 'BDA', 'AI': 'ML', 'DAA': 'ADS', 'DBMS': 'DBMS-II', 'OE': 'Open Elective (AIDS)', 'PL-II': 'Mini Project (AIDS)', 'Sem Project': 'Domain Project (AIDS)'},
            'IT': {'PSI': 'CN', 'AI': 'SEPM', 'DAA': 'WT', 'DBMS': 'ADBMS', 'OE': 'Open Elective (IT)', 'PL-II': 'Mini Project (IT)', 'Sem Project': 'Domain Project (IT)'},
        }

        for branch in branches:
            subj_map = subject_map_by_branch.get(branch.name, {})
            print(f"Seeding {branch.name}...")
            for slot_num, start, end, day, subject, stype, section in TIMETABLE_AIML:
                mapped_subject = subj_map.get(subject, subject)
                slot = TimetableSlot(
                    branch=branch,
                    day=day,
                    slot_number=slot_num,
                    start_time=start,
                    end_time=end,
                    subject_name=mapped_subject,
                    subject_type=stype,
                    section=section,
                    professor=get_professor(mapped_subject, stype, section)
                ).save()
        
        print("✅ Seeding complete callback.")

if __name__ == '__main__':
    seed()
