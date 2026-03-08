# 📘 Student Diary — Academic Performance & Risk Identification System

A premium full-stack web application for students to track their academic performance, attendance, coding activity, and goals — built with Flask, MongoDB, and a professional blue glassmorphism UI.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **🔐 Auth** | Signup with Name, Email, Roll No, PRN, Photo, Branch & Section |
| **👤 Profile** | Edit all your details and manage your profile photo in real-time |
| **📊 Dashboard** | Overview of attendance health, pending tasks, and coding stats |
| **📅 Attendance** | Lecture-wise attendance based on your timetable with automatic day detection |
| **🎯 CGPA Target** | Calculate required SGPA to achieve your target CGPA |
| **✅ To-Do List** | Manage academic and personal goals with type-based categorization |
| **💻 Coding Stats** | Track problems solved and ratings across platforms (LeetCode, etc.) |

---

## 🛠️ Tech Stack

- **Backend:** Python 3.12, Flask, Flask-Login, MongoEngine
- **Database:** MongoDB (Atlas or Local)
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript
- **Design:** Professional blue theme with high-end glassmorphism and premium assets

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secure_random_string
FLASK_DEBUG=True
```

### 3. Start the Server
```bash
python app.py
```

---

## ☁️ Deployment Guide

This project is pre-configured for **Render** and **Vercel**.

### Render (Recommended)
1. **Connect Repository**: Link your GitHub repo to Render.
2. **Select Web Service**: Choose "Python" as the environment.
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `gunicorn app:app`
5. **Environment Variables**: Add `MONGO_URI` and `SECRET_KEY` in the Render dashboard.

### Vercel
1. **Connect Repository**: Link your repo to Vercel.
2. **Framework Preset**: Vercel will auto-detect Flask (Python) via `vercel.json`.
3. **Environment Variables**: Add `MONGO_URI` and `SECRET_KEY` in Settings > Environment Variables.

---

## 📁 Project Structure

```
student_performance_system/
├── app.py                  # Flask application & core routes
├── models.py               # MongoEngine database models
├── populate_demo_data.py   # Seed script for demo accounts (e.g., Rahul)
├── requirements.txt        # Production dependencies
├── Procfile                # Render/Heroku process file
├── vercel.json             # Vercel serverless configuration
├── runtime.txt             # Python version specification
├── static/                 # CSS, JS, and Branding images
└── templates/              # Jinja2 HTML templates
```

---

## 👨‍💻 Demo Account

| Field | Value |
|-------|-------|
| **Username** | `Rahul` |
| **Password** | `Rahul#123` |

---

## 📝 Performance Notes

- **Attendance Logic**: Practicals are filtered by section. Students only see slots relevant to their batch (S1/S2/S3).
- **Risk Analysis**: The system flags **Critical** status if attendance drops below 75% or tasks pile up.
- **Safety**: Robust error handling implemented for database references and orphaned records.
