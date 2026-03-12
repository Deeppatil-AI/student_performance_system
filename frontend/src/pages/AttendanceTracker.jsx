import { useState } from 'react';
import AttendanceCard from '../components/AttendanceCard';
import { Plus, BookOpen, AlertTriangle } from 'lucide-react';

const initialSubjects = [
  { id: 1, subject: 'Operating Systems',      total: 48, attended: 42 },
  { id: 2, subject: 'Database Management',    total: 44, attended: 38 },
  { id: 3, subject: 'Computer Networks',      total: 50, attended: 30 },
  { id: 4, subject: 'Software Engineering',   total: 40, attended: 38 },
  { id: 5, subject: 'Data Structures & Algo', total: 52, attended: 40 },
  { id: 6, subject: 'Machine Learning',       total: 36, attended: 28 },
];

let nextId = 7;

export default function AttendanceTracker() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [form, setForm]         = useState({ subject: '', total: '', attended: '' });
  const [adding, setAdding]     = useState(false);

  const totalAll    = subjects.reduce((a, s) => a + s.total,    0);
  const attendedAll = subjects.reduce((a, s) => a + s.attended, 0);
  const overallPct  = totalAll ? Math.round((attendedAll / totalAll) * 100) : 0;
  const atRisk      = subjects.filter((s) => s.total > 0 && Math.round((s.attended / s.total) * 100) < 75);

  const addSubject = () => {
    const { subject, total, attended } = form;
    if (!subject.trim() || !total || !attended) return;
    setSubjects((s) => [...s, { id: nextId++, subject, total: +total, attended: +attended }]);
    setForm({ subject: '', total: '', attended: '' });
    setAdding(false);
  };

  const markClass = (id, present) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, total: s.total + 1, attended: s.attended + (present ? 1 : 0) } : s
      )
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Overall summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{overallPct}%</p>
          <p className="text-sm text-slate-500 mt-1">Overall Attendance</p>
          <div className="progress-bar mt-3">
            <div className="progress-fill gradient-primary" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-teal-600">{attendedAll}</p>
          <p className="text-sm text-slate-500 mt-1">Classes Attended</p>
          <p className="text-xs text-slate-400 mt-1">out of {totalAll} total</p>
        </div>
        <div className="card text-center">
          <p className={`text-3xl font-bold ${atRisk.length > 0 ? 'text-red-500' : 'text-green-600'}`}>{atRisk.length}</p>
          <p className="text-sm text-slate-500 mt-1">Subjects at Risk</p>
          {atRisk.length > 0 && (
            <div className="flex items-center justify-center gap-1 mt-1 text-red-500 text-xs">
              <AlertTriangle className="w-3 h-3" /> Below 75%
            </div>
          )}
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" /> Subject Breakdown
        </h2>
        <button onClick={() => setAdding((a) => !a)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card space-y-3 border-2 border-primary-200 animate-fade-in">
          <h3 className="font-semibold text-slate-700 text-sm">New Subject</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Subject name"    value={form.subject}  onChange={(e) => setForm({ ...form, subject:  e.target.value })} className="input-field" />
            <input placeholder="Total classes"   value={form.total}    onChange={(e) => setForm({ ...form, total:    e.target.value })} type="number" className="input-field" />
            <input placeholder="Attended"        value={form.attended} onChange={(e) => setForm({ ...form, attended: e.target.value })} type="number" className="input-field" />
          </div>
          <div className="flex gap-2">
            <button onClick={addSubject} className="btn-primary text-sm">Add Subject</button>
            <button onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <div key={s.id} className="space-y-2">
            <AttendanceCard subject={s.subject} total={s.total} attended={s.attended} />
            <div className="flex gap-2">
              <button onClick={() => markClass(s.id, true)}  className="flex-1 text-xs py-1.5 rounded-lg bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors">+ Present</button>
              <button onClick={() => markClass(s.id, false)} className="flex-1 text-xs py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">+ Absent</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
