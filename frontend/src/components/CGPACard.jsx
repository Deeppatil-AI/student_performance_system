import { TrendingUp, Target } from 'lucide-react';

export default function CGPACard({ currentCGPA, targetCGPA, remainingSemesters, requiredSGPA }) {
  const progress = (currentCGPA / 10) * 100;
  const isAchievable = requiredSGPA !== null && requiredSGPA <= 10;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-slate-800 text-sm">CGPA Progress</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-primary-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary-700">{currentCGPA.toFixed(2)}</p>
          <p className="text-xs text-primary-500 mt-0.5">Current CGPA</p>
        </div>
        <div className="bg-surface-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-slate-700">{targetCGPA.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Target CGPA</p>
        </div>
      </div>

      <div className="progress-bar mb-3">
        <div className="progress-fill gradient-primary" style={{ width: `${progress}%` }} />
      </div>

      {requiredSGPA !== null && (
        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
          isAchievable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <Target className="w-4 h-4 flex-shrink-0" />
          {isAchievable
            ? `You need ${requiredSGPA.toFixed(2)} SGPA for next ${remainingSemesters} sem(s)`
            : 'Target not achievable with remaining semesters'
          }
        </div>
      )}
    </div>
  );
}
