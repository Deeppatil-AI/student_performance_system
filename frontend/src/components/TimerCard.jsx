import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerCard({ timeLeft, isRunning, onStart, onPause, onReset, mode }) {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const total = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((total - timeLeft) / total) * 100;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="card flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
        <Clock className="w-4 h-4" />
        <span>{mode === 'focus' ? 'Focus Session' : 'Short Break'}</span>
      </div>

      {/* Circular Progress */}
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" strokeWidth="10" className="fill-none stroke-surface-100" />
          <circle
            cx="100" cy="100" r="90"
            strokeWidth="10"
            fill="none"
            stroke="url(#timerGrad)"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-800 tabular-nums">{minutes}:{seconds}</span>
          <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={onReset} className="btn-secondary flex items-center gap-2 text-sm">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        {isRunning ? (
          <button onClick={onPause} className="btn-primary flex items-center gap-2 text-sm px-8">
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button onClick={onStart} className="btn-primary flex items-center gap-2 text-sm px-8">
            <Play className="w-4 h-4" /> Start
          </button>
        )}
      </div>
    </div>
  );
}
