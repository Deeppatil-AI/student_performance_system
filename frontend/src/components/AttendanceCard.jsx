export default function AttendanceCard({ subject, total, attended }) {
  const percentage = total === 0 ? 0 : Math.round((attended / total) * 100);
  const status =
    percentage >= 75 ? { label: 'Good', color: 'text-green-600', bg: 'bg-green-100', fill: 'bg-green-500' } :
    percentage >= 60 ? { label: 'Low',  color: 'text-amber-600', bg: 'bg-amber-100', fill: 'bg-amber-400' } :
                       { label: 'Poor', color: 'text-red-600',   bg: 'bg-red-100',   fill: 'bg-red-500'   };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{subject}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{attended}/{total} classes</p>
        </div>
        <span className={`stat-badge ${status.bg} ${status.color}`}>{status.label}</span>
      </div>

      {/* Progress */}
      <div className="progress-bar mb-2">
        <div
          className={`progress-fill ${status.fill}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Attendance</span>
        <span className={`font-bold text-base ${status.color}`}>{percentage}%</span>
      </div>
    </div>
  );
}
