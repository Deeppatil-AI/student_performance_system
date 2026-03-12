import { useState } from 'react';
import { UserCircle, Save, Camera, Mail, GraduationCap, BookOpen, Target } from 'lucide-react';

const INITIAL = {
  name:       'Alex Student',
  email:      'alex@university.edu',
  university: 'IIT Bombay',
  branch:     'Computer Science',
  semester:   '6th Semester',
  cgpaTarget: '9.0',
  studyGoal:  'Score above 9 CGPA and crack FAANG interviews by December.',
  avatar:     '',
};

export default function EditProfile() {
  const [form, setForm]     = useState(INITIAL);
  const [saved, setSaved]   = useState(false);
  const [editing, setEdit]  = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setEdit(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Profile header */}
      <div className="card gradient-primary text-white p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {form.name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors">
            <Camera className="w-4 h-4 text-primary-600" />
          </button>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">{form.name}</h1>
          <p className="text-primary-200 text-sm mt-0.5">{form.email}</p>
          <p className="text-primary-200 text-sm">{form.university} • {form.branch}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">{form.semester}</span>
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">CGPA Target: {form.cgpaTarget}</span>
          </div>
        </div>
        <div className="sm:ml-auto">
          <button
            onClick={() => setEdit((e) => !e)}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium animate-fade-in">
          <Save className="w-4 h-4" /> Profile saved successfully!
        </div>
      )}

      {/* Form */}
      <div className="card space-y-5">
        <h2 className="font-bold text-slate-700 flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-primary-500" /> Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center gap-1.5"><UserCircle className="w-3.5 h-3.5" /> Full Name</label>
            <input value={form.name} onChange={set('name')} disabled={!editing} className="input-field disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
            <input value={form.email} onChange={set('email')} disabled={!editing} type="email" className="input-field disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> University</label>
            <input value={form.university} onChange={set('university')} disabled={!editing} className="input-field disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Branch</label>
            <input value={form.branch} onChange={set('branch')} disabled={!editing} className="input-field disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed" />
          </div>
          <div>
            <label className="label">Semester</label>
            <select value={form.semester} onChange={set('semester')} disabled={!editing} className="input-field disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed">
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s}>{s}{['st','nd','rd','th','th','th','th','th'][s-1]} Semester</option>)}
            </select>
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> CGPA Target</label>
            <input value={form.cgpaTarget} onChange={set('cgpaTarget')} disabled={!editing} type="number" step="0.1" min="0" max="10" className="input-field disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="label">Study Goals</label>
          <textarea
            value={form.studyGoal}
            onChange={set('studyGoal')}
            disabled={!editing}
            rows={4}
            placeholder="Describe your study goals…"
            className="input-field resize-none disabled:bg-surface-100 disabled:text-slate-500 disabled:cursor-not-allowed"
          />
        </div>

        {editing && (
          <div className="flex gap-3 pt-2 animate-fade-in">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={() => { setForm(INITIAL); setEdit(false); }} className="btn-secondary">Discard</button>
          </div>
        )}
      </div>
    </div>
  );
}
