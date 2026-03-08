# ⚡ Nexus — Student Performance Prediction & Early Risk Identification System

A full-stack web application for students to track their academic performance, attendance, coding activity, and goals — built with Flask, SQLite, and a modern dark glassmorphism UI.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **🔐 Auth** | Signup with Name, Roll No, PRN, Photo (optional), Branch & Section |
| **📊 Dashboard** | Overview of attendance health, pending tasks, and coding stats |
| **📅 Attendance** | Lecture-wise attendance based on your timetable, with real-time "LIVE NOW" indicator |
| **🎯 CGPA Target** | Calculate required SGPA to achieve your target CGPA |
| **✅ To-Do List** | Manage daily, weekly, and monthly goals |
| **💻 Coding Stats** | Track problems solved and ratings across platforms |

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask, Flask-Login, Flask-SQLAlchemy
- **Database:** SQLite
- **Frontend:** HTML5, CSS3, JavaScript
- **Design:** Dark theme with glassmorphism, Inter font, FontAwesome icons

---

## 🚀 How to Run

### 1. Install Dependencies

```bash

```pip install -r requirements.txt

### 2. Seed the Timetable (first time only)

```bash
python seed_timetable.py
```

### 3. Start the Server

```bash
python app.py
```

### 4. Open in Browser

Go to **http://localhost:5000**

---

## 📁 Project Structure

```
student_performance_system/
├── app.py                  # Main Flask application & routes
├── models.py               # Database models (User, Branch, Attendance, etc.)
├── seed_timetable.py       # Timetable seed script (AIML, AIDS, IT)
├── requirements.txt        # Python dependencies
├── instance/
│   └── database.db         # SQLite database (auto-created)
├── static/
│   ├── style.css           # All CSS styles
│   ├── script.js           # Client-side JavaScript
│   └── uploads/            # Student profile photos
└── templates/
    ├── base.html            # Base layout with sidebar
    ├── auth.html            # Login & Signup pages
    ├── dashboard.html       # Dashboard overview
    ├── attendance.html      # Lecture-wise attendance tracker
    ├── cgpa.html            # CGPA target calculator
    ├── todo.html            # To-Do list manager
    └── coding.html          # Coding activity tracker
```

---

## 📋 Supported Branches

| Branch | Status |
|--------|--------|
| SY BTech AIML | ✅ Added |
| SY BTech AIDS | ✅ Added |
| SY BTech IT   | ✅ Added |

---

## 👨‍💻 Default Test Account

| Field | Value |
|-------|-------|
| Username | `rahul123` |
| Password | `test1234` |
| Branch | SY BTech AIML |
| Section | S1 |

---

## 📝 Notes

- The attendance tracker auto-detects the day of the week and shows the correct lectures
- Practicals are filtered by section (S1/S2/S3) — students only see their own batch
- Attendance below 75% is flagged as **Critical** ⚠️
- Photo upload is optional and limited to 2MB (JPG, PNG, GIF, WebP)
