from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import db, User, Branch, TimetableSlot, LectureAttendance, Todo, CodingStat
from datetime import datetime, date, timedelta
from sqlalchemy import func
import os
import calendar

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev_secret_key_123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Photo upload config
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Festival / public holidays for the current academic semester (2025-26)
# Only major festival holidays that affect lectures are included here.
HOLIDAYS = {
    date(2026, 2, 18): "Shivaji Maharaj Jayanti",
    date(2026, 3, 3): "Dhulivandan",
    date(2026, 3, 18): "Gudhi Padwa",
    date(2026, 3, 21): "Ramjan Eid",
    date(2026, 3, 26): "Shriram Navami",
    date(2026, 3, 31): "Mahavir Jayanti",
    date(2026, 4, 3): "Good Friday",
    date(2026, 4, 14): "Dr. Babasaheb Ambedkar Jayanti",
    date(2026, 6, 27): "Bakrid",
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user, remember=True)
            return redirect(url_for('dashboard'))
        else:
            flash('Login failed. Check your username and password.', category='error')

    return render_template('auth.html', is_login=True)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    branches = Branch.query.all()
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        full_name = request.form.get('full_name', '').strip()
        roll_no = request.form.get('roll_no', '').strip()
        prn = request.form.get('prn', '').strip()
        branch_id = request.form.get('branch_id', type=int)
        section = request.form.get('section')

        user = User.query.filter_by(username=username).first()
        if user:
            flash('Username already exists.', category='error')
        elif len(username) < 2:
            flash('Username must be greater than 1 character.', category='error')
        elif len(password) < 6:
            flash('Password must be at least 6 characters.', category='error')
        elif not full_name:
            flash('Please enter your full name.', category='error')
        elif not roll_no:
            flash('Please enter your roll number.', category='error')
        elif not prn:
            flash('Please enter your PRN.', category='error')
        elif not branch_id:
            flash('Please select your branch.', category='error')
        elif not section:
            flash('Please select your section.', category='error')
        else:
            # Handle optional photo upload
            photo_filename = None
            photo = request.files.get('photo')
            if photo and photo.filename and allowed_file(photo.filename):
                filename = secure_filename(f"{username}_{photo.filename}")
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo_filename = filename

            new_user = User(
                username=username,
                password=generate_password_hash(password, method='pbkdf2:sha256'),
                full_name=full_name,
                roll_no=roll_no,
                prn=prn,
                photo=photo_filename,
                branch_id=branch_id,
                section=section
            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            return redirect(url_for('dashboard'))

    return render_template('auth.html', is_login=False, branches=branches)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


def get_user_slots_for_day(user, day_name):
    """Get timetable slots for a user's branch/section for a given day."""
    if not user.branch_id:
        return []
    slots = TimetableSlot.query.filter_by(
        branch_id=user.branch_id,
        day=day_name
    ).filter(
        (TimetableSlot.section.is_(None)) | (TimetableSlot.section == user.section)
    ).order_by(TimetableSlot.slot_number).all()
    return slots


def get_attendance_summary(user):
    """Calculate subject-wise attendance summary for the user."""
    if not user.branch_id:
        return []

    # Get all unique subjects for this branch (that the user's section can attend)
    all_slots = TimetableSlot.query.filter_by(branch_id=user.branch_id).filter(
        (TimetableSlot.section.is_(None)) | (TimetableSlot.section == user.section)
    ).all()

    # Build subject -> slot_ids mapping
    subject_slots = {}
    for slot in all_slots:
        key = f"{slot.subject_name} ({slot.subject_type})"
        if key not in subject_slots:
            subject_slots[key] = []
        subject_slots[key].append(slot.id)

    # Get attendance records
    summary = []
    for subject_label, slot_ids in subject_slots.items():
        total = LectureAttendance.query.filter(
            LectureAttendance.user_id == user.id,
            LectureAttendance.timetable_slot_id.in_(slot_ids)
        ).count()
        attended = LectureAttendance.query.filter(
            LectureAttendance.user_id == user.id,
            LectureAttendance.timetable_slot_id.in_(slot_ids),
            LectureAttendance.status == 'present'
        ).count()
        pct = (attended / total * 100) if total > 0 else 0
        summary.append({
            'subject': subject_label,
            'total': total,
            'attended': attended,
            'percentage': pct,
            'status': 'safe' if pct >= 75 else ('critical' if total > 0 else 'na')
        })

    # Sort: critical first, then by name
    summary.sort(key=lambda x: (0 if x['status'] == 'critical' else 1, x['subject']))
    return summary

def calculate_risk_score(summary, todos, coding_stats):
    """Calculate an early risk profile based on student data."""
    risk_level = 'Low Risk'
    risk_color = 'success'
    advice = 'Keep up the excellent work! You are on track.'
    
    # Check attendance risk
    low_attendance_subjects = [s for s in summary if s['percentage'] < 75 and s['total'] > 0]
    
    # Check tasks risk
    pending_tasks = len(todos)
    
    # Check coding risk 
    total_solved = sum(c.problems_solved for c in coding_stats)
    
    risk_factors = 0
    if len(low_attendance_subjects) >= 2:
        risk_factors += 2
    elif len(low_attendance_subjects) == 1:
        risk_factors += 1
        
    if pending_tasks > 10:
        risk_factors += 2
    elif pending_tasks > 5:
        risk_factors += 1
        
    if total_solved == 0:
        risk_factors += 1
        
    if risk_factors >= 3:
        risk_level = 'High Risk'
        risk_color = 'danger'
        advice = 'Critical: Immediate action needed. Improve attendance and clear pending tasks.'
    elif risk_factors >= 1:
        risk_level = 'Moderate Risk'
        risk_color = 'warning'
        advice = 'Warning: You are falling behind in some areas. Focus on pending tasks or attendance.'
        
    return {
        'level': risk_level,
        'color': risk_color,
        'advice': advice
    }


@app.route('/dashboard')
@login_required
def dashboard():
    summary = get_attendance_summary(current_user)
    todos = Todo.query.filter_by(user_id=current_user.id, completed=False).all()
    coding_stats = CodingStat.query.filter_by(user_id=current_user.id).all()

    total_lectures = sum(s['total'] for s in summary)
    attended_lectures = sum(s['attended'] for s in summary)
    overall_attendance = (attended_lectures / total_lectures * 100) if total_lectures > 0 else 0

    total_solved = sum(c.problems_solved for c in coding_stats)

    # Calculate Risk Score
    risk_profile = calculate_risk_score(summary, todos, coding_stats)
    
    # Prepare Data for Chart.js
    chart_subjects = [s['subject'] for s in summary]
    chart_attendance_pct = [s['percentage'] for s in summary]
    
    chart_platforms = [c.platform for c in coding_stats]
    chart_problems = [c.problems_solved for c in coding_stats]

    return render_template('dashboard.html',
                           user=current_user,
                           overall_attendance=overall_attendance,
                           pending_tasks_count=len(todos),
                           total_solved=total_solved,
                           risk_profile=risk_profile,
                           chart_subjects=chart_subjects,
                           chart_attendance_pct=chart_attendance_pct,
                           chart_platforms=chart_platforms,
                           chart_problems=chart_problems)


@app.route('/attendance', methods=['GET', 'POST'])
@login_required
def attendance():
    # Get selected date (default is today)
    today = date.today()
    selected_date_str = request.args.get('date', today.isoformat())
    try:
        selected_date = date.fromisoformat(selected_date_str)
    except ValueError:
        selected_date = today

    day_name = calendar.day_name[selected_date.weekday()]  # Monday, Tuesday, etc.

    # Get today's slots for this user
    slots = get_user_slots_for_day(current_user, day_name)

    # Disallow marking attendance for future dates
    is_future = selected_date > today
    holiday_name = HOLIDAYS.get(selected_date)

    if request.method == 'POST':
        if is_future:
            flash('You can only mark attendance for today or past dates.', category='error')
            return redirect(url_for('attendance', date=today.isoformat()))

        # Save attendance for each slot
        for slot in slots:
            status = request.form.get(f'slot_{slot.id}')
            if status in ('present', 'absent'):
                # Upsert: update if exists, create if not
                existing = LectureAttendance.query.filter_by(
                    user_id=current_user.id,
                    date=selected_date,
                    timetable_slot_id=slot.id
                ).first()

                if existing:
                    existing.status = status
                else:
                    new_att = LectureAttendance(
                        user_id=current_user.id,
                        date=selected_date,
                        timetable_slot_id=slot.id,
                        status=status
                    )
                    db.session.add(new_att)

        db.session.commit()
        flash('Attendance saved successfully!', category='success')
        return redirect(url_for('attendance', date=selected_date.isoformat()))

    # Get existing attendance records for this date
    existing_records = {}
    records = LectureAttendance.query.filter_by(
        user_id=current_user.id,
        date=selected_date
    ).all()
    for rec in records:
        existing_records[rec.timetable_slot_id] = rec.status

    # Get current time for real-time lecture highlighting
    now = datetime.now()
    current_time_str = now.strftime('%H:%M')

    # Determine if the selected date is today
    is_today = (selected_date == today)

    # Subject-wise summary
    summary = get_attendance_summary(current_user)

    return render_template('attendance.html',
                           user=current_user,
                           slots=slots,
                           existing_records=existing_records,
                           selected_date=selected_date,
                           today=today,
                           day_name=day_name,
                           current_time=current_time_str,
                           is_today=is_today,
                           is_future=is_future,
                           holiday_name=holiday_name,
                           summary=summary)


@app.route('/cgpa', methods=['GET'])
@login_required
def cgpa():
    return render_template('cgpa.html', user=current_user)

@app.route('/timer', methods=['GET'])
@login_required
def timer():
    return render_template('timer.html', user=current_user)

@app.route('/todo', methods=['GET', 'POST'])
@login_required
def todo():
    if request.method == 'POST':
        task = request.form.get('task')
        task_type = request.form.get('type')

        if len(task) > 0:
            new_todo = Todo(task=task, type=task_type, user_id=current_user.id)
            db.session.add(new_todo)
            db.session.commit()
            flash('Task added!', category='success')

    todos = Todo.query.filter_by(user_id=current_user.id).order_by(Todo.date_added.desc()).all()
    return render_template('todo.html', user=current_user, todos=todos)

@app.route('/todo/toggle/<int:id>', methods=['POST'])
@login_required
def toggle_todo(id):
    todo = Todo.query.get_or_404(id)
    if todo.user_id == current_user.id:
        todo.completed = not todo.completed
        db.session.commit()
    return redirect(url_for('todo'))

@app.route('/todo/delete/<int:id>', methods=['POST'])
@login_required
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    if todo.user_id == current_user.id:
        db.session.delete(todo)
        db.session.commit()
    return redirect(url_for('todo'))

@app.route('/coding', methods=['GET', 'POST'])
@login_required
def coding():
    if request.method == 'POST':
        platform = request.form.get('platform')
        problems = request.form.get('problems_solved', type=int)
        rating = request.form.get('rating', type=int)

        if platform and problems >= 0:
            stat = CodingStat(platform=platform, problems_solved=problems, rating=rating, user_id=current_user.id)
            db.session.add(stat)
            db.session.commit()
            flash('Coding activity added!', category='success')

    stats = CodingStat.query.filter_by(user_id=current_user.id).all()
    return render_template('coding.html', user=current_user, stats=stats)


@app.route('/coding/delete/<int:id>', methods=['POST'])
@login_required
def delete_coding(id):
    stat = CodingStat.query.get_or_404(id)
    if stat.user_id == current_user.id:
        db.session.delete(stat)
        db.session.commit()
    return redirect(url_for('coding'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
