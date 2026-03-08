"""
Seed script to populate timetable data for multiple branches.
Run once: python seed_timetable.py
"""
from app import app, db
from models import Branch, TimetableSlot

# Teaching Staff mapping (shared across branches that use these subjects)
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

# Practical professors (section-wise overrides)
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

# Timetable definition: list of (slot, start, end, day, subject, type, section)
# NOTE: For simplicity, all branches share the same time grid
# but we will remap subject names per branch while seeding so
# that AIML / AIDS / IT each get their own subject set.
TIMETABLE_AIML = []

def add_slot(slot, start, end, day, subject, stype='TH', section=None):
    TIMETABLE_AIML.append((slot, start, end, day, subject, stype, section))

# ---- SLOT 1: 09:20 - 10:10 ----
for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday']:
    add_slot(1, '09:20', '10:10', day, 'PSI')
add_slot(1, '09:20', '10:10', 'Friday', 'UHV')
add_slot(1, '09:20', '10:10', 'Saturday', 'Sem Project')

# ---- SLOT 2: 10:10 - 11:00 ----
for day in ['Monday', 'Tuesday', 'Wednesday']:
    add_slot(2, '10:10', '11:00', day, 'DAA')
add_slot(2, '10:10', '11:00', 'Thursday', 'AI')
add_slot(2, '10:10', '11:00', 'Friday', 'Library Hour')
add_slot(2, '10:10', '11:00', 'Saturday', 'UHV')

# ---- SLOT 3: 11:50 - 12:40 ----
for day in ['Monday', 'Tuesday', 'Wednesday']:
    add_slot(3, '11:50', '12:40', day, 'AI')
# Thursday slots 3-4: 2-hour practical block (merged cell)
add_slot(3, '11:50', '12:40', 'Thursday', 'PL-II', 'PR', 'S1')
add_slot(3, '11:50', '12:40', 'Thursday', 'AI', 'PR', 'S2')
add_slot(3, '11:50', '12:40', 'Thursday', 'DAA', 'PR', 'S3')
add_slot(3, '11:50', '12:40', 'Friday', 'DBMS')
add_slot(3, '11:50', '12:40', 'Saturday', 'Sem Project')

# ---- SLOT 4: 12:40 - 13:30 ----
for day in ['Monday', 'Tuesday']:
    add_slot(4, '12:40', '13:30', day, 'DBMS')
add_slot(4, '12:40', '13:30', 'Wednesday', 'DAA')
# Thursday slot 4: continuation of 2-hour practical block
add_slot(4, '12:40', '13:30', 'Thursday', 'PL-II', 'PR', 'S1')
add_slot(4, '12:40', '13:30', 'Thursday', 'AI', 'PR', 'S2')
add_slot(4, '12:40', '13:30', 'Thursday', 'DAA', 'PR', 'S3')
add_slot(4, '12:40', '13:30', 'Friday', 'UHV')
add_slot(4, '12:40', '13:30', 'Saturday', 'DBMS')

# ---- SLOT 5: 13:45 - 14:35 ----
# Monday: DTL(PR)-S1, DAA(PR)-S2, AI(PR)-S3
add_slot(5, '13:45', '14:35', 'Monday', 'DTL', 'PR', 'S1')
add_slot(5, '13:45', '14:35', 'Monday', 'DAA', 'PR', 'S2')
add_slot(5, '13:45', '14:35', 'Monday', 'AI', 'PR', 'S3')
# Tuesday: DBMS(PR)-S1, DTL(PR)-S2, PL-II(PR)-S3
add_slot(5, '13:45', '14:35', 'Tuesday', 'DBMS', 'PR', 'S1')
add_slot(5, '13:45', '14:35', 'Tuesday', 'DTL', 'PR', 'S2')
add_slot(5, '13:45', '14:35', 'Tuesday', 'PL-II', 'PR', 'S3')
# Wednesday & Thursday: #OE
add_slot(5, '13:45', '14:35', 'Wednesday', 'OE')
add_slot(5, '13:45', '14:35', 'Thursday', 'OE')
# Friday: DAA(PR)-S1, DBMS(PR)-S2, DTL(PR)-S3
add_slot(5, '13:45', '14:35', 'Friday', 'DAA', 'PR', 'S1')
add_slot(5, '13:45', '14:35', 'Friday', 'DBMS', 'PR', 'S2')
add_slot(5, '13:45', '14:35', 'Friday', 'DTL', 'PR', 'S3')
# Saturday: AI(PR)-S1, PL-II(PR)-S2, DBMS(PR)-S3
add_slot(5, '13:45', '14:35', 'Saturday', 'AI', 'PR', 'S1')
add_slot(5, '13:45', '14:35', 'Saturday', 'PL-II', 'PR', 'S2')
add_slot(5, '13:45', '14:35', 'Saturday', 'DBMS', 'PR', 'S3')

# ---- SLOT 6: 14:35 - 15:25 (same as slot 5 — 2-hour practical block) ----
# Monday
add_slot(6, '14:35', '15:25', 'Monday', 'DTL', 'PR', 'S1')
add_slot(6, '14:35', '15:25', 'Monday', 'DAA', 'PR', 'S2')
add_slot(6, '14:35', '15:25', 'Monday', 'AI', 'PR', 'S3')
# Tuesday
add_slot(6, '14:35', '15:25', 'Tuesday', 'DBMS', 'PR', 'S1')
add_slot(6, '14:35', '15:25', 'Tuesday', 'DTL', 'PR', 'S2')
add_slot(6, '14:35', '15:25', 'Tuesday', 'PL-II', 'PR', 'S3')
# Wednesday & Thursday: #OE
add_slot(6, '14:35', '15:25', 'Wednesday', 'OE')
add_slot(6, '14:35', '15:25', 'Thursday', 'OE')
# Friday
add_slot(6, '14:35', '15:25', 'Friday', 'DAA', 'PR', 'S1')
add_slot(6, '14:35', '15:25', 'Friday', 'DBMS', 'PR', 'S2')
add_slot(6, '14:35', '15:25', 'Friday', 'DTL', 'PR', 'S3')
# Saturday
add_slot(6, '14:35', '15:25', 'Saturday', 'AI', 'PR', 'S1')
add_slot(6, '14:35', '15:25', 'Saturday', 'PL-II', 'PR', 'S2')
add_slot(6, '14:35', '15:25', 'Saturday', 'DBMS', 'PR', 'S3')


def seed():
    with app.app_context():
        # Clear existing timetable data
        TimetableSlot.query.delete()
        db.session.commit()

        # Get or create branches
        aiml = Branch.query.filter_by(name='AIML').first()
        if not aiml:
            aiml = Branch(
                name='AIML',
                full_name='Artificial Intelligence & Machine Learning',
                year='SY BTech'
            )
            db.session.add(aiml)
            db.session.flush()

        aids = Branch.query.filter_by(name='AIDS').first()
        if not aids:
            aids = Branch(
                name='AIDS',
                full_name='Artificial Intelligence & Data Science',
                year='SY BTech'
            )
            db.session.add(aids)
            db.session.flush()

        it = Branch.query.filter_by(name='IT').first()
        if not it:
            it = Branch(
                name='IT',
                full_name='Information Technology',
                year='SY BTech'
            )
            db.session.add(it)
            db.session.flush()

        branches = [aiml, aids, it]

        # Subject name remapping per branch so attendance views
        # clearly show different timetables for AIML / AIDS / IT.
        subject_map_by_branch = {
            'AIML': {
                # keep original AIML subjects
            },
            'AIDS': {
                'PSI': 'BDA',
                'AI': 'ML',
                'DAA': 'ADS',
                'DBMS': 'DBMS-II',
                'OE': 'Open Elective (AIDS)',
                'UHV': 'UHV',
                'DTL': 'DTL',
                'PL-II': 'Mini Project (AIDS)',
                'Sem Project': 'Domain Project (AIDS)',
                'Library Hour': 'Library / Reading',
            },
            'IT': {
                'PSI': 'CN',
                'AI': 'SEPM',
                'DAA': 'WT',
                'DBMS': 'ADBMS',
                'OE': 'Open Elective (IT)',
                'UHV': 'UHV',
                'DTL': 'DTL',
                'PL-II': 'Mini Project (IT)',
                'Sem Project': 'Domain Project (IT)',
                'Library Hour': 'Library / Reading',
            },
        }

        # Insert timetable slots for each branch
        for branch in branches:
            subj_map = subject_map_by_branch.get(branch.name, {})
            for slot_num, start, end, day, subject, stype, section in TIMETABLE_AIML:
                mapped_subject = subj_map.get(subject, subject)
                prof = get_professor(mapped_subject, stype, section)
                slot = TimetableSlot(
                    branch_id=branch.id,
                    day=day,
                    slot_number=slot_num,
                    start_time=start,
                    end_time=end,
                    subject_name=mapped_subject,
                    subject_type=stype,
                    section=section,
                    professor=prof
                )
                db.session.add(slot)

        db.session.commit()
        for branch in branches:
            count = TimetableSlot.query.filter_by(branch_id=branch.id).count()
            print(f"✅ Seeded {branch.name} branch with {count} timetable slots.")


if __name__ == '__main__':
    seed()
