import { useState } from 'react';
import CodingActivityCard from '../components/CodingActivityCard';
import { Code2, Plus, Flame, TrendingUp, Trophy } from 'lucide-react';

const initialPlatforms = [
  { id: 1, platform: 'LeetCode',   solved: 148, streak: 7,  weeklyGoal: 7,  weeklyDone: 5 },
  { id: 2, platform: 'CodeForces', solved: 63,  streak: 3,  weeklyGoal: 5,  weeklyDone: 3 },
  { id: 3, platform: 'HackerRank', solved: 92,  streak: 12, weeklyGoal: 5,  weeklyDone: 5 },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dailySolved = [3, 5, 2, 7, 4, 6, 0]; // problems solved each day this week

let nextPId = 4;

export default function CodingActivity() {
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ platform: '', solved: '', streak: '', weeklyGoal: '', weeklyDone: '' });

  const totalSolved = platforms.reduce((a, p) => a + p.solved, 0);
  const maxStreak   = Math.max(...platforms.map((p) => p.streak));

  const addPlatform = () => {
    const { platform, solved, streak, weeklyGoal, weeklyDone } = form;
    if (!platform.trim()) return;
    setPlatforms((p) => [...p, {
      id: nextPId++,
      platform,
      solved:     +solved || 0,
      streak:     +streak || 0,
      weeklyGoal: +weeklyGoal || 5,
      weeklyDone: +weeklyDone || 0,
    }]);
    setForm({ platform: '', solved: '', streak: '', weeklyGoal: '', weeklyDone: '' });
    setAdding(false);
  };

  const logProblem = (id) => {
    setPlatforms((prev) =>
      prev.map((p) => p.id === id ? { ...p, solved: p.solved + 1, weeklyDone: Math.min(p.weeklyDone + 1, p.weeklyGoal) } : p)
    );
  };

  const maxBar = Math.max(...dailySolved, 1);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
            <Code2 className="w-6 h-6 text-violet-600" />
          </div>
          <p className="text-3xl font-bold text-violet-700">{totalSolved}</p>
          <p className="text-sm text-slate-500 mt-1">Total Problems</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-3">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{maxStreak}</p>
          <p className="text-sm text-slate-500 mt-1">Best Streak (days)</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-700">{platforms.length}</p>
          <p className="text-sm text-slate-500 mt-1">Platforms Active</p>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-slate-700 text-sm">Weekly Activity</h2>
          <span className="ml-auto text-xs text-slate-400">{dailySolved.reduce((a,b)=>a+b,0)} problems this week</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {dailySolved.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-primary-600">{count > 0 ? count : ''}</span>
              <div className="w-full rounded-t-lg gradient-primary opacity-80 transition-all duration-500"
                   style={{ height: `${(count / maxBar) * 100}%`, minHeight: count > 0 ? '8px' : '0' }} />
              <span className="text-xs text-slate-400">{weekDays[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform cards */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-700">Platforms</h2>
        <button onClick={() => setAdding((a) => !a)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Platform
        </button>
      </div>

      {adding && (
        <div className="card space-y-3 border-2 border-primary-200 animate-fade-in">
          <h3 className="font-semibold text-slate-700 text-sm">New Platform</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input placeholder="Platform name"   value={form.platform}   onChange={(e) => setForm({ ...form, platform:   e.target.value })} className="input-field col-span-2 sm:col-span-1" />
            <input placeholder="Problems solved"  value={form.solved}     onChange={(e) => setForm({ ...form, solved:     e.target.value })} type="number" className="input-field" />
            <input placeholder="Current streak"  value={form.streak}     onChange={(e) => setForm({ ...form, streak:     e.target.value })} type="number" className="input-field" />
            <input placeholder="Weekly goal"     value={form.weeklyGoal} onChange={(e) => setForm({ ...form, weeklyGoal: e.target.value })} type="number" className="input-field" />
            <input placeholder="Done this week"  value={form.weeklyDone} onChange={(e) => setForm({ ...form, weeklyDone: e.target.value })} type="number" className="input-field" />
          </div>
          <div className="flex gap-2">
            <button onClick={addPlatform} className="btn-primary text-sm">Add</button>
            <button onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <div key={p.id} className="space-y-2">
            <CodingActivityCard {...p} />
            <button
              onClick={() => logProblem(p.id)}
              className="w-full text-xs py-2 rounded-xl bg-violet-50 text-violet-700 font-semibold hover:bg-violet-100 transition-colors"
            >
              + Log Problem Solved
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
