# 🎓 StudyTrack — Student Performance System

A full-stack student productivity and academic performance tracking application. The project has been fully migrated to a modern **React + Vite + Tailwind CSS** frontend with a **Flask + MongoDB** backend.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **📊 Dashboard** | Overview cards for study hours, tasks, attendance, CGPA, coding activity + quick-access links and recent activity feed |
| **⏱️ Study Timer** | Pomodoro-style timer (Focus / Short Break / Long Break) with circular animated progress, session counter, skip, and session log |
| **✅ To-Do List** | Add, complete, and delete tasks with priority levels (Low / Medium / High), filter by status, and an overall progress bar |
| **📅 Attendance Tracker** | Per-subject attendance cards with progress bars, overall summary, at-risk subject detection, and mark Present/Absent buttons |
| **🎯 CGPA Target Calculator** | Input current CGPA, target CGPA, and remaining semesters — dynamically calculates required SGPA per semester |
| **💻 Coding Activity Tracker** | Platform-wise problem count, daily streak, weekly progress bar, a weekly activity bar chart, and log problem button |
| **👤 Edit Profile** | Editable profile form (name, email, university, branch, semester, CGPA target, study goals) with save/discard and success toast |
| **🔐 Auth (Backend)** | Signup with Name, Email, Roll No, PRN, Photo, Branch & Section via Flask sessions |

---

## 🛠️ Tech Stack

### Frontend (New — React + Vite)
- **Framework:** React 18 + Vite 6
- **Styling:** Tailwind CSS 3 with custom design tokens, gradient utilities, animations, and glassmorphism
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **UI Design:** Stitch-generated screen references + custom premium implementation

### Backend (Flask)
- **Runtime:** Python 3.12, Flask, Flask-Login, MongoEngine
- **Database:** MongoDB (Atlas or Local)
- **Email:** SMTP via Gmail (OTP-based authentication)

---

## 📁 Project Structure

```
student_performance_system/
├── backend/
│   ├── app.py                  # Flask application & API routes
│   ├── models.py               # MongoEngine database models
│   ├── requirements.txt        # Python dependencies
│   └── ...
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── assets/
│   │   │   └── stitch/         # Stitch-generated UI reference screenshots
│   │   │       ├── dashboard.png
│   │   │       ├── study-timer.png
│   │   │       ├── todo.png
│   │   │       ├── attendance.png
│   │   │       ├── cgpa.png
│   │   │       ├── coding.png
│   │   │       └── edit-profile.png
│   │   │
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TimerCard.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── AttendanceCard.jsx
│   │   │   ├── CodingActivityCard.jsx
│   │   │   └── CGPACard.jsx
│   │   │
│   │   ├── layout/
│   │   │   └── MainLayout.jsx  # Sidebar + Navbar wrapper layout
│   │   │
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudyTimer.jsx
│   │   │   ├── TodoList.jsx
│   │   │   ├── AttendanceTracker.jsx
│   │   │   ├── CGPATarget.jsx
│   │   │   ├── CodingActivity.jsx
│   │   │   └── EditProfile.jsx
│   │   │
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx            # App entry point
│   │   └── index.css           # Tailwind directives + design system
│   │
│   ├── tailwind.config.js      # Custom Tailwind theme (colors, animations)
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Running Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

### Backend

```bash
pip install -r backend/requirements.txt
```

Create a `.env` file in the root:
```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secure_random_string
FLASK_DEBUG=True
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_app_password
```

Start the Flask server:
```bash
python backend/app.py
```

---

## 🗺️ Frontend Routes

| Route | Page |
|-------|------|
| `/` | Dashboard |
| `/timer` | Study Timer |
| `/todo` | To-Do List |
| `/attendance` | Attendance Tracker |
| `/cgpa` | CGPA Target Calculator |
| `/coding` | Coding Activity Tracker |
| `/profile` | Edit Profile |

---

## 🎨 Design System

The frontend uses a custom Tailwind-based design system with:

- **Primary color:** Indigo (`#6366f1`) with a gradient scale
- **Accent colors:** Purple, Teal, Amber, Rose for different modules
- **Components:** `.card`, `.btn-primary`, `.btn-secondary`, `.input-field`, `.nav-link`, `.progress-bar`
- **Animations:** `animate-fade-in`, `animate-slide-up`, `animate-pulse-slow`
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

## ☁️ Deployment

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build   # outputs to frontend/dist/
```

Deploy the `dist/` folder to Vercel or Netlify.

### Backend (Render)

1. Connect your GitHub repository to [Render](https://render.com).
2. Set **Build Command:** `pip install -r backend/requirements.txt`
3. Set **Start Command:** `gunicorn backend.app:app`
4. Add environment variables: `MONGO_URI`, `SECRET_KEY`, `SMTP_EMAIL`, `SMTP_PASSWORD`

---

## 👨‍💻 Demo Account

| Field | Value |
|-------|-------|
| **Username** | `Rahul` |
| **Password** | `Rahul#123` |

---

## 📝 Notes

- **Attendance Logic:** Practicals are filtered by section (S1/S2/S3). Students only see their relevant batch slots.
- **Risk Detection:** System flags subjects below 75% attendance as "at risk."
- **CGPA Formula:** `Required SGPA = (Target × Total Semesters − Current CGPA × Completed Semesters) / Remaining Semesters`
- **Timer Modes:** Focus (25 min), Short Break (5 min), Long Break (15 min) — Pomodoro technique.
- **State:** All frontend data is currently stored in React local state (no backend calls yet for frontend pages).

---

## 🧱 Recent Changes (March 2026)

- ✅ **Migrated frontend** from HTML/CSS/JS + Jinja2 templates to React 18 + Vite + Tailwind CSS
- ✅ **Created 8 reusable components:** Navbar, Sidebar, StatCard, TimerCard, TodoItem, AttendanceCard, CodingActivityCard, CGPACard
- ✅ **Built 7 full pages:** Dashboard, StudyTimer, TodoList, AttendanceTracker, CGPATarget, CodingActivity, EditProfile
- ✅ **Configured React Router v7** with nested routes under MainLayout
- ✅ **Downloaded Stitch UI assets** for all 7 screens as design references
- ✅ **Implemented Email OTP authentication** system on the Flask backend
- ✅ **Custom Tailwind design system** with gradients, animations, and glass utilities
