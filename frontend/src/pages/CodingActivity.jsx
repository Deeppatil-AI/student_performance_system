import { useState } from 'react';
import { 
  CheckCircle2, 
  Target, 
  Trophy, 
  Code2, 
  ChevronRight, 
  Zap, 
  Globe, 
  Terminal,
  BarChart3,
  Award,
  Star,
  Activity
} from 'lucide-react';

export default function CodingActivity() {
  const [activeTab, setActiveTab] = useState('monthly');

  const topStats = [
    { label: 'Total Solved', value: '1,248', change: '+12% growth', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Monthly Target', value: '85.4%', change: '+5.2% accuracy', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Global Rank', value: '#2,415', change: 'Top 5%', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const platforms = [
    { name: 'LeetCode', rank: 'Knight', solved: 542, total: 1000, color: 'bg-amber-500', text: 'text-amber-500', icon: Code2 },
    { name: 'HackerRank', rank: '5 Star', solved: 420, total: 500, color: 'bg-emerald-500', text: 'text-emerald-500', icon: CheckCircle2 },
    { name: 'CodeChef', rank: '3 Star', solved: 286, total: 600, color: 'bg-rose-500', text: 'text-rose-500', icon: Award },
  ];

  const difficultyStats = [
    { label: 'EASY', value: '642', trend: '↑ 14%', color: 'text-emerald-400' },
    { label: 'MEDIUM', value: '412', trend: '↑ 8%', color: 'text-orange-400' },
    { label: 'HARD', value: '194', trend: '→ 0%', color: 'text-rose-400' },
    { label: 'POINTS', value: '42.5k', unit: 'XP', color: 'text-amber-400' },
  ];

  // Mock data for stacked bar chart: Jan to Dec
  const chartData = [
    { month: 'JAN', leet: 40, hacker: 30, chef: 20 },
    { month: 'FEB', leet: 55, hacker: 25, chef: 35 },
    { month: 'MAR', leet: 45, hacker: 20, chef: 15 },
    { month: 'APR', leet: 70, hacker: 40, chef: 30 },
    { month: 'MAY', leet: 60, hacker: 35, chef: 25 },
    { month: 'JUN', leet: 40, hacker: 30, chef: 20 },
    { month: 'JUL', leet: 85, hacker: 45, chef: 35 },
    { month: 'AUG', leet: 50, hacker: 30, chef: 25 },
    { month: 'SEP', leet: 30, hacker: 20, chef: 15 },
    { month: 'OCT', leet: 65, hacker: 40, chef: 30 },
    { month: 'NOV', leet: 55, hacker: 30, chef: 25 },
    { month: 'DEC', leet: 75, hacker: 45, chef: 40 },
  ];

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Coding Stats</h1>
        <p className="text-dim font-medium italic">Real-time performance metrics across competitive platforms</p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topStats.map((stat, i) => (
          <div key={i} className="card p-6 border-orange-500/5 group hover:border-orange-500/20 relative overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white/5`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/10`}>
                {stat.change}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-dim uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/[0.01] blur-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-start">
        {/* Main Chart Column */}
        <div className="lg:col-span-5 card min-h-[500px] flex flex-col group overflow-hidden border-orange-500/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-orange-600 rounded-full shadow-glow" />
              <h3 className="text-xl font-black text-white tracking-tight">Performance Analytics</h3>
            </div>
            
            <div className="flex p-1.5 bg-dark-900 border border-dark-700/50 rounded-2xl shadow-inner">
              <button 
                onClick={() => setActiveTab('weekly')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'weekly' ? 'bg-orange-600 text-white shadow-lg' : 'text-dim hover:text-white'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setActiveTab('monthly')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'monthly' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'text-dim hover:text-white'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between h-72 gap-2 md:gap-4 px-2">
              {chartData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center group/bar max-w-[32px] h-full relative">
                  <div className="w-full h-[85%] flex flex-col-reverse items-center gap-0.5 mb-2 group-hover:scale-y-105 transition-transform duration-500 origin-bottom group-hover:brightness-110">
                    {/* Stacked Bars */}
                    <div className="w-full rounded-t-sm bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]" style={{ height: `${data.chef}%` }} />
                    <div className="w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" style={{ height: `${data.hacker}%` }} />
                    <div className="w-full rounded-b-sm bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" style={{ height: `${data.leet}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-dim tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity mt-auto">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-6 justify-center">
             {[
               { label: 'LeetCode', color: 'bg-amber-500' },
               { label: 'HackerRank', color: 'bg-emerald-500' },
               { label: 'CodeChef', color: 'bg-rose-500' }
             ].map(p => (
               <div key={p.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span className="text-[10px] font-black text-dim uppercase tracking-widest">{p.label}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Platform Sidebar Column */}
        <div className="lg:col-span-2 space-y-4">
           {platforms.map((p) => (
             <div key={p.name} className="card p-5 border-orange-500/5 hover:border-orange-500/20 group transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center ${p.text} group-hover:scale-110 transition-transform`}>
                         <p.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="font-black text-white text-sm">{p.name}</h4>
                         <p className="text-[10px] font-bold text-dim uppercase tracking-tight">{p.rank}</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-bold text-dim uppercase opacity-50">{p.rank}</span>
                </div>
                
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                      <span className="text-dim opacity-70">{p.solved} / {p.total} SOLVED</span>
                      <span className={p.text}>{Math.round((p.solved/p.total)*100)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full ${p.color} rounded-full transition-all duration-1000 ease-out shadow-glow`}
                        style={{ width: `${(p.solved/p.total)*100}%` }}
                      />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Bottom Difficulty Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {difficultyStats.map((stat, i) => (
          <div key={i} className="card p-6 border-orange-500/5 group hover:border-orange-500/20">
            <p className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <div className="flex items-end gap-3 translate-y-2">
               <h3 className="text-3xl font-black text-white leading-none">{stat.value}</h3>
               {stat.unit && <span className="text-sm font-black text-dim mb-1">{stat.unit}</span>}
               {stat.trend && (
                 <span className={`text-[10px] font-black ${stat.trend.includes('↑') ? 'text-emerald-400' : 'text-dim'} ml-1 mb-1.5`}>
                   {stat.trend}
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
