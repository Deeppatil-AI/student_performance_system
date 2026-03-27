from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import User, Branch, TimetableSlot, LectureAttendance, Todo, CodingStat, Notification
from mongoengine import connect, Q, DoesNotExist
from datetime import datetime, date, timedelta
import os
import calendar
from dotenv import load_dotenv

from flask_cors import CORS

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
SECRET_KEY = os.getenv('SECRET_KEY')

if not MONGO_URI:
    print("WARNING: MONGO_URI not set. Application might fail to connect to database.")
if not SECRET_KEY:
    print("WARNING: SECRET_KEY not set. Using insecure default.")

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = SECRET_KEY or 'dev_secret_key_123'

# MongoDB Connection
if MONGO_URI:
    connect(host=MONGO_URI)
else:
    # Fallback to local if URI is missing (for local dev without .env)
    connect('student_performance_db')

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

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.objects(username=username).first()
    if user and check_password_hash(user.password, password):
        login_user(user, remember=True)
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "full_name": user.full_name
            }
        }), 200
    return jsonify({"error": "Invalid username or password"}), 401

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
    # Returning a simple message if template is missing
    try:
        return render_template('auth.html', is_login=True)
    except:
        return "Login page - please use the React frontend at http://localhost:5173"

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
        email = request.form.get('email', '').strip()

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
                full_name=full_name, roll_no=roll_no, prn=prn, email=email,
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
    try:
        if not user.branch: return []
    except DoesNotExist:
        return []
    return TimetableSlot.objects(branch=user.branch, day=day_name).filter(
        Q(section=None) | Q(section=user.section)
    ).order_by('slot_number')

def get_attendance_summary(user):
    try:
        if not user.branch: return []
    except DoesNotExist:
        return []
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

@app.route('/api/dashboard')
@login_required
def api_dashboard():
    summary = get_attendance_summary(current_user)
    todos = Todo.objects(student=current_user, completed=False)
    coding_stats = CodingStat.objects(student=current_user)
    total_lectures = sum(s['total'] for s in summary)
    attended_lectures = sum(s['attended'] for s in summary)
    overall_attendance = (attended_lectures / total_lectures * 100) if total_lectures > 0 else 0
    total_solved = sum(c.problems_solved for c in coding_stats)
    risk_profile = calculate_risk_score(summary, todos, coding_stats)
    
    return jsonify({
        "user": {
            "full_name": current_user.full_name,
            "username": current_user.username,
            "photo": current_user.photo,
            "branch": current_user.branch.name if current_user.branch else None,
            "section": current_user.section
        },
        "overall_attendance": overall_attendance,
        "pending_tasks_count": len(todos),
        "total_solved": total_solved,
        "risk_profile": risk_profile,
        "attendance_summary": summary,
        "coding_stats": [
            {"platform": c.platform, "problems_solved": c.problems_solved, "rating": c.rating}
            for c in coding_stats
        ]
    })

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
    try:
        return render_template('dashboard.html', user=current_user, overall_attendance=overall_attendance,
                           pending_tasks_count=len(todos), total_solved=total_solved, risk_profile=risk_profile,
                           chart_subjects=[s['subject'] for s in summary], chart_attendance_pct=[s['percentage'] for s in summary],
                           chart_platforms=[c.platform for c in coding_stats], chart_problems=[c.problems_solved for c in coding_stats])
    except:
        return redirect("http://localhost:5173/")

@app.route('/api/attendance', methods=['GET', 'POST'])
@login_required
def api_attendance():
    today = date.today()
    selected_date_str = request.args.get('date', today.isoformat())
    try: selected_date = date.fromisoformat(selected_date_str)
    except: selected_date = today
    day_name = calendar.day_name[selected_date.weekday()]
    slots = get_user_slots_for_day(current_user, day_name)
    
    if request.method == 'POST':
        data = request.get_json()
        slot_id = data.get('slot_id')
        status = data.get('status') # 'present', 'absent', or ''
        
        if selected_date > today:
            return jsonify({"error": "Future date attendance not allowed"}), 400
            
        slot = TimetableSlot.objects(id=slot_id).first()
        if not slot:
            return jsonify({"error": "Slot not found"}), 404
            
        dt = datetime.combine(selected_date, datetime.min.time())
        if status in ('present', 'absent'):
            LectureAttendance.objects(student=current_user, date=dt, timetable_slot=slot).update_one(set__status=status, upsert=True)
        else:
            LectureAttendance.objects(student=current_user, date=dt, timetable_slot=slot).delete()
            
        return jsonify({"message": "Attendance updated"})

    existing_records = {}
    dt = datetime.combine(selected_date, datetime.min.time())
    for rec in LectureAttendance.objects(student=current_user, date=dt):
        existing_records[str(rec.timetable_slot.id)] = rec.status
        
    return jsonify({
        "date": selected_date.isoformat(),
        "day_name": day_name,
        "slots": [
            {
                "id": str(s.id),
                "time": f"{s.start_time} - {s.end_time}",
                "slot": f"Slot {s.slot_number}",
                "subject": s.subject_name,
                "type": s.subject_type,
                "prof": s.professor,
                "status": existing_records.get(str(s.id))
            } for s in slots
        ]
    })

@app.route('/attendance', methods=['GET', 'POST'])
@login_required
def attendance():
    today = date.today()
    selected_date_str = request.args.get('date', today.isoformat())
    try: selected_date = date.fromisoformat(selected_date_str)
    except: selected_date = today
    day_name = calendar.day_name[selected_date.weekday()]
    slots = get_user_slots_for_day(current_user, day_name)
    try:
        if request.method == 'POST':
            if selected_date > today:
                flash('Future date attendance not allowed.', category='error')
                return redirect(url_for('attendance', date=today.isoformat()))
            
            current_time = datetime.now().strftime('%H:%M')
            updated_count = 0
            
            for slot in slots:
                status = request.form.get(f'slot_{slot.id}')
                is_markable = (selected_date < today) or (selected_date == today and current_time >= slot.end_time)
                
                if is_markable:
                    dt = datetime.combine(selected_date, datetime.min.time())
                    if status in ('present', 'absent'):
                        LectureAttendance.objects(student=current_user, date=dt, timetable_slot=slot).update_one(set__status=status, upsert=True)
                        updated_count += 1
                    elif status == '':
                        LectureAttendance.objects(student=current_user, date=dt, timetable_slot=slot).delete()
                        updated_count += 1

            if updated_count > 0:
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
    except:
        return redirect("http://localhost:5173/attendance")

@app.route('/api/todo', methods=['GET', 'POST'])
@login_required
def api_todo():
    if request.method == 'POST':
        data = request.get_json()
        task = data.get('task')
        type = data.get('type')
        if task:
            new_todo = Todo(task=task, type=type, student=current_user).save()
            return jsonify({
                "id": str(new_todo.id),
                "task": new_todo.task,
                "type": new_todo.type,
                "completed": new_todo.completed,
                "date_added": new_todo.date_added.isoformat()
            }), 201
        return jsonify({"error": "Task description required"}), 400
    
    todos = Todo.objects(student=current_user).order_by('-date_added')
    return jsonify([
        {
            "id": str(t.id),
            "task": t.task,
            "type": t.type,
            "completed": t.completed,
            "date_added": t.date_added.isoformat()
        } for t in todos
    ])

@app.route('/todo', methods=['GET', 'POST'])
@login_required
def todo():
    if request.method == 'POST':
        task = request.form.get('task')
        if task: Todo(task=task, type=request.form.get('type'), student=current_user).save()
    todos = Todo.objects(student=current_user).order_by('-date_added')
    try:
        return render_template('todo.html', user=current_user, todos=todos)
    except:
        return redirect("http://localhost:5173/todo")

@app.route('/api/todo/toggle/<id>', methods=['POST'])
@login_required
def api_toggle_todo(id):
    todo = Todo.objects(id=id, student=current_user).first()
    if todo:
        todo.completed = not todo.completed
        todo.save()
        return jsonify({"message": "Todo updated", "completed": todo.completed})
    return jsonify({"error": "Todo not found"}), 404

@app.route('/todo/toggle/<id>', methods=['POST'])
@login_required
def toggle_todo(id):
    todo = Todo.objects(id=id, student=current_user).first()
    if todo:
        todo.completed = not todo.completed
        todo.save()
    return redirect(url_for('todo'))

@app.route('/api/todo/delete/<id>', methods=['DELETE'])
@login_required
def api_delete_todo(id):
    Todo.objects(id=id, student=current_user).delete()
    return jsonify({"message": "Todo deleted"})

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

@app.route('/api/profile', methods=['GET', 'POST'])
@login_required
def api_profile():
    if request.method == 'POST':
        data = request.get_json()
        current_user.full_name = data.get('name', current_user.full_name) # Frontend uses 'name'
        current_user.email = data.get('email', current_user.email)
        current_user.leetcode = data.get('leetcode', '')
        current_user.hackerrank = data.get('hackerrank', '')
        current_user.codechef = data.get('codechef', '')
        current_user.github = data.get('github', '')
        current_user.university = data.get('university', '')
        current_user.semester = data.get('semester', '')
        current_user.cgpa_target = data.get('cgpaTarget', '') # Frontend uses cgpaTarget
        
        # Preserve other fields or allow updates
        if 'roll_no' in data: current_user.roll_no = data.get('roll_no')
        if 'prn' in data: current_user.prn = data.get('prn')
        
        current_user.save()
        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "full_name": current_user.full_name,
                "leetcode": current_user.leetcode,
                "university": current_user.university,
                "semester": current_user.semester,
                "cgpaTarget": current_user.cgpa_target
            }
        }), 200
        
    return jsonify({
        "name": current_user.full_name,
        "email": current_user.email,
        "roll_no": current_user.roll_no,
        "prn": current_user.prn,
        "branch": current_user.branch.name if current_user.branch else "",
        "section": current_user.section,
        "university": current_user.university or "",
        "semester": current_user.semester or "1st Semester",
        "cgpaTarget": current_user.cgpa_target or "",
        "leetcode": current_user.leetcode or "",
        "hackerrank": current_user.hackerrank or "",
        "codechef": current_user.codechef or "",
        "github": current_user.github or ""
    })

@app.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    branches = Branch.objects().all()
    if request.method == 'POST':
        current_user.full_name = request.form.get('full_name', '').strip()
        current_user.email = request.form.get('email', '').strip()
        current_user.roll_no = request.form.get('roll_no', '').strip()
        current_user.prn = request.form.get('prn', '').strip()
        current_user.section = request.form.get('section')
        
        branch_id = request.form.get('branch_id')
        if branch_id:
            current_user.branch = Branch.objects(id=branch_id).first()
            
        remove_photo = request.form.get('remove_photo') == 'true'
        if remove_photo and current_user.photo:
            photo_path = os.path.join(app.config['UPLOAD_FOLDER'], current_user.photo)
            if os.path.exists(photo_path):
                try:
                    os.remove(photo_path)
                except Exception as e:
                    print(f"Error deleting photo: {e}")
            current_user.photo = None

        photo = request.files.get('photo')
        if photo and photo.filename and allowed_file(photo.filename):
            # If new photo is uploaded, it overrides the 'remove_photo' flag
            filename = secure_filename(f"{current_user.username}_{photo.filename}")
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            current_user.photo = filename
            
        current_user.save()
        flash('Profile updated successfully!', category='success')
        return redirect(url_for('dashboard'))
        
    return render_template('edit_profile.html', user=current_user, branches=branches)

@app.route('/api/notifications', methods=['GET'])
@login_required
def api_get_notifications():
    # Helper to seed some demo notifications if few exist
    if Notification.objects(student=current_user).count() < 5:
        demo_notes = [
            {"title": "Welcome to Student Diary", "desc": "Explore your dashboard to see your academic progress.", "type": "info"},
            {"title": "Low Attendance Alert", "desc": "Your attendance in Mathematics is currently 72%.", "type": "danger"},
            {"title": "Assignment Deadline", "desc": "Software Engineering: Project Phase 1 is due in 24 hours.", "type": "warning"},
            {"title": "New Coding Milestone", "desc": "You just reached a 50-day streak on LeetCode!", "type": "success"},
            {"title": "System Update", "desc": "New features added to the Profile and Alerts sections.", "type": "zap"}
        ]
        for note in demo_notes:
            Notification(student=current_user, **note).save()

    notes = Notification.objects(student=current_user).order_by('-date_added')
    return jsonify([{
        "id": str(n.id),
        "title": n.title,
        "desc": n.desc,
        "type": n.type,
        "read": n.read,
        "time": n.date_added.strftime("%Y-%m-%d %H:%M:%S")
    } for n in notes])

@app.route('/api/notifications/read/<note_id>', methods=['POST'])
@login_required
def api_mark_notification_read(note_id):
    try:
        note = Notification.objects.get(id=note_id, student=current_user)
        note.read = True
        note.save()
        return jsonify({"message": "Marked as read"}), 200
    except DoesNotExist:
        return jsonify({"error": "Notification not found"}), 404

@app.route('/api/notifications/<note_id>', methods=['DELETE'])
@login_required
def api_delete_notification(note_id):
    try:
        note = Notification.objects.get(id=note_id, student=current_user)
        note.delete()
        return jsonify({"message": "Deleted"}), 200
    except DoesNotExist:
        return jsonify({"error": "Notification not found"}), 404

if __name__ == '__main__':
    # Use environment variables for port and host, with defaults for local development
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
    app.run(host='0.0.0.0', port=port, debug=debug)
