import { useState, useEffect, useRef } from 'react';
import TimerCard from '../components/TimerCard';
import { Coffee, Brain, SkipForward, Volume2 } from 'lucide-react';

const SESSIONS = {
  focus: { label: 'Focus',       duration: 25 * 60, desc: '25 minutes of deep work' },
  short: { label: 'Short Break', duration:  5 * 60, desc: '5 minute breather' },
  long:  { label: 'Long Break',  duration: 15 * 60, desc: '15 minute rest' },
};

const completedLog = [
  { type: 'Focus',       duration: '25:00', time: '2:30 PM' },
  { type: 'Short Break', duration: '5:00',  time: '2:55 PM' },
  { type: 'Focus',       duration: '25:00', time: '3:00 PM' },
];

export default function StudyTimer() {
  const [mode, setMode]       = useState('focus');
  const [timeLeft, setLeft]   = useState(SESSIONS.focus.duration);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles]   = useState(0);
  const intervalRef           = useRef(null);

  useEffect(() => {
    setLeft(SESSIONS[mode].duration);
    setRunning(false);
    clearInterval(intervalRef.current);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setCycles((c) => c + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setLeft(SESSIONS[mode].duration);
  };

  const skip = () => {
    setMode((m) => m === 'focus' ? 'short' : 'focus');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-slide-up">
      {/* Mode selector */}
      <div className="card p-2 flex gap-2">
        {Object.entries(SESSIONS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === key
                ? 'gradient-primary text-white shadow-sm'
                : 'text-slate-500 hover:bg-surface-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <TimerCard
        timeLeft={timeLeft}
        isRunning={running}
        onStart={() => setRunning(true)}
        onPause={() => setRunning(false)}
        onReset={reset}
        mode={mode}
      />

      {/* Tips & stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
            <Brain className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Sessions Today</p>
            <p className="text-2xl font-bold text-primary-600">{cycles}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Study Time</p>
            <p className="text-2xl font-bold text-teal-600">{Math.floor(cycles * 25 / 60)}h {(cycles * 25) % 60}m</p>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between">
        <button onClick={skip} className="btn-secondary flex items-center gap-2 text-sm">
          <SkipForward className="w-4 h-4" /> Skip
        </button>
        <p className="text-sm text-slate-500 italic">{SESSIONS[mode].desc}</p>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Volume2 className="w-4 h-4" /> Sound
        </button>
      </div>

      {/* Session log */}
      <div className="card">
        <h2 className="font-bold text-slate-700 text-sm mb-4">Session Log</h2>
        <div className="space-y-2">
          {completedLog.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 text-sm">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.type === 'Focus' ? 'bg-primary-500' : 'bg-teal-400'}`} />
              <span className="flex-1 text-slate-700 font-medium">{s.type}</span>
              <span className="text-slate-400">{s.duration}</span>
              <span className="text-slate-400">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
