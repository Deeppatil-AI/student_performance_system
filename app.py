from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import User, Branch, TimetableSlot, LectureAttendance, Todo, CodingStat
from mongoengine import connect, Q
from datetime import datetime, date, timedelta
import os
import calendar
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_secret_key_123')

# MongoDB Connection
connect(host=os.getenv('MONGO_URI'))

# Photo upload config
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.objects(id=user_id).first()
    except:
        return None

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
        user = User.objects(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user, remember=True)
            return redirect(url_for('dashboard'))
        flash('Login failed.', category='error')
    return render_template('auth.html', is_login=True)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    branches = Branch.objects().all()
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        full_name = request.form.get('full_name', '').strip()
        roll_no = request.form.get('roll_no', '').strip()
        prn = request.form.get('prn', '').strip()
        branch_id = request.form.get('branch_id')
        section = request.form.get('section')

        if User.objects(username=username).first():
            flash('Username already exists.', category='error')
        elif not full_name or not branch_id:
            flash('Missing required fields.', category='error')
        else:
            photo_filename = None
            photo = request.files.get('photo')
            if photo and photo.filename and allowed_file(photo.filename):
                filename = secure_filename(f"{username}_{photo.filename}")
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo_filename = filename

            branch_obj = Branch.objects(id=branch_id).first()
            new_user = User(
                username=username,
                password=generate_password_hash(password, method='pbkdf2:sha256'),
                full_name=full_name, roll_no=roll_no, prn=prn,
                photo=photo_filename, branch=branch_obj, section=section
            )
            new_user.save()
            login_user(new_user, remember=True)
            return redirect(url_for('dashboard'))

    return render_template('auth.html', is_login=False, branches=branches)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

def get_user_slots_for_day(user, day_name):
    if not user.branch: return []
    return TimetableSlot.objects(branch=user.branch, day=day_name).filter(
        Q(section=None) | Q(section=user.section)
    ).order_by('slot_number')

def get_attendance_summary(user):
    if not user.branch: return []
    all_slots = TimetableSlot.objects(branch=user.branch).filter(
        Q(section=None) | Q(section=user.section)
    )
    subject_slots = {}
    for slot in all_slots:
        key = f"{slot.subject_name} ({slot.subject_type})"
        if key not in subject_slots: subject_slots[key] = []
        subject_slots[key].append(slot.id)

    summary = []
    for subject_label, slot_ids in subject_slots.items():
        total = LectureAttendance.objects(student=user, timetable_slot__in=slot_ids).count()
        attended = LectureAttendance.objects(student=user, timetable_slot__in=slot_ids, status='present').count()
        pct = (attended / total * 100) if total > 0 else 0
        summary.append({
            'subject': subject_label, 'total': total, 'attended': attended, 'percentage': pct,
            'status': 'safe' if pct >= 75 else ('critical' if total > 0 else 'na')
        })
    summary.sort(key=lambda x: (0 if x['status'] == 'critical' else 1, x['subject']))
    return summary

def calculate_risk_score(summary, todos, coding_stats):
    risk_level, risk_color, advice = 'Low Risk', 'success', 'Keep up the excellent work!'
    low_attendance_subjects = [s for s in summary if s['percentage'] < 75 and s['total'] > 0]
    pending_tasks = len(todos)
    total_solved = sum(c.problems_solved for c in coding_stats)
    
    risk_factors = 0
    if len(low_attendance_subjects) >= 2: risk_factors += 2
    elif len(low_attendance_subjects) == 1: risk_factors += 1
    if pending_tasks > 10: risk_factors += 2
    elif pending_tasks > 5: risk_factors += 1
    if total_solved == 0: risk_factors += 1
        
    if risk_factors >= 3: risk_level, risk_color, advice = 'High Risk', 'danger', 'Critical actions needed.'
    elif risk_factors >= 1: risk_level, risk_color, advice = 'Moderate Risk', 'warning', 'Focused effort required.'
    return {'level': risk_level, 'color': risk_color, 'advice': advice}

@app.route('/dashboard')
@login_required
def dashboard():
    summary = get_attendance_summary(current_user)
    todos = Todo.objects(student=current_user, completed=False)
    coding_stats = CodingStat.objects(student=current_user)
    total_lectures = sum(s['total'] for s in summary)
    attended_lectures = sum(s['attended'] for s in summary)
    overall_attendance = (attended_lectures / total_lectures * 100) if total_lectures > 0 else 0
    total_solved = sum(c.problems_solved for c in coding_stats)
    risk_profile = calculate_risk_score(summary, todos, coding_stats)
    return render_template('dashboard.html', user=current_user, overall_attendance=overall_attendance,
                           pending_tasks_count=len(todos), total_solved=total_solved, risk_profile=risk_profile,
                           chart_subjects=[s['subject'] for s in summary], chart_attendance_pct=[s['percentage'] for s in summary],
                           chart_platforms=[c.platform for c in coding_stats], chart_problems=[c.problems_solved for c in coding_stats])

@app.route('/attendance', methods=['GET', 'POST'])
@login_required
def attendance():
    today = date.today()
    selected_date_str = request.args.get('date', today.isoformat())
    try: selected_date = date.fromisoformat(selected_date_str)
    except: selected_date = today
    day_name = calendar.day_name[selected_date.weekday()]
    slots = get_user_slots_for_day(current_user, day_name)
    if request.method == 'POST':
        if selected_date > today:
            flash('Future date attendance not allowed.', category='error')
            return redirect(url_for('attendance', date=today.isoformat()))
        for slot in slots:
            status = request.form.get(f'slot_{slot.id}')
            if status in ('present', 'absent'):
                dt = datetime.combine(selected_date, datetime.min.time())
                LectureAttendance.objects(student=current_user, date=dt, timetable_slot=slot).update_one(set__status=status, upsert=True)
        flash('Attendance saved!', category='success')
        return redirect(url_for('attendance', date=selected_date.isoformat()))

    existing_records = {}
    dt = datetime.combine(selected_date, datetime.min.time())
    for rec in LectureAttendance.objects(student=current_user, date=dt):
        existing_records[str(rec.timetable_slot.id)] = rec.status
    return render_template('attendance.html', user=current_user, slots=slots, existing_records=existing_records,
                           selected_date=selected_date, today=today, day_name=day_name,
                           current_time=datetime.now().strftime('%H:%M'), is_today=(selected_date == today),
                           is_future=(selected_date > today), holiday_name=HOLIDAYS.get(selected_date),
                           summary=get_attendance_summary(current_user))

@app.route('/todo', methods=['GET', 'POST'])
@login_required
def todo():
    if request.method == 'POST':
        task = request.form.get('task')
        if task: Todo(task=task, type=request.form.get('type'), student=current_user).save()
    todos = Todo.objects(student=current_user).order_by('-date_added')
    return render_template('todo.html', user=current_user, todos=todos)

@app.route('/todo/toggle/<id>', methods=['POST'])
@login_required
def toggle_todo(id):
    todo = Todo.objects(id=id, student=current_user).first()
    if todo:
        todo.completed = not todo.completed
        todo.save()
    return redirect(url_for('todo'))

@app.route('/todo/delete/<id>', methods=['POST'])
@login_required
def delete_todo(id):
    Todo.objects(id=id, student=current_user).delete()
    return redirect(url_for('todo'))

@app.route('/coding', methods=['GET', 'POST'])
@login_required
def coding():
    if request.method == 'POST':
        platform = request.form.get('platform')
        problems = request.form.get('problems_solved', type=int)
        if platform and problems >= 0:
            CodingStat(platform=platform, problems_solved=problems, rating=request.form.get('rating', type=int), student=current_user).save()
    return render_template('coding.html', user=current_user, stats=CodingStat.objects(student=current_user))

@app.route('/coding/delete/<id>', methods=['POST'])
@login_required
def delete_coding(id):
    CodingStat.objects(id=id, student=current_user).delete()
    return redirect(url_for('coding'))

@app.route('/cgpa')
@login_required
def cgpa(): return render_template('cgpa.html', user=current_user)

@app.route('/timer')
@login_required
def timer(): return render_template('timer.html', user=current_user)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
