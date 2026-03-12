import { Flame, Code2, Calendar } from 'lucide-react';

export default function CodingActivityCard({ platform, solved, streak, weeklyGoal, weeklyDone }) {
  const weeklyPct = Math.min(100, Math.round((weeklyDone / weeklyGoal) * 100));

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-slate-800 text-sm">{platform}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-orange-500">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-bold">{streak} day streak</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-primary-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary-700">{solved}</p>
          <p className="text-xs text-primary-500 mt-0.5">Problems Solved</p>
        </div>
        <div className="bg-surface-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-slate-700">{weeklyDone}</p>
          <p className="text-xs text-slate-400 mt-0.5">This Week</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Weekly Goal</div>
          <span className="font-semibold">{weeklyDone}/{weeklyGoal}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill gradient-primary" style={{ width: `${weeklyPct}%` }} />
        </div>
      </div>
    </div>
  );
}
