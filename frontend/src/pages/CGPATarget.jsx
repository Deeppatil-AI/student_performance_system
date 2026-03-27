import { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  Zap, 
  TrendingUp, 
  Gauge, 
  Lightbulb, 
  ChevronRight,
  Info,
  Trophy
} from 'lucide-react';

export default function CGPATarget() {
  const [currentCGPA, setCurrentCGPA] = useState('8.42');
  const [creditsCompleted, setCreditsCompleted] = useState('');
  const [targetCGPA, setTargetCGPA] = useState('9.15');
  const [remainingCredits, setRemainingCredits] = useState('');
  const [result, setResult] = useState({
    requiredSGPA: '9.59',
    gap: '+0.73',
    successRate: 'High',
    efficiency: '+12%',
    effort: 'Advanced Effort'
  });

  const calculatePath = () => {
    const cc = parseFloat(currentCGPA);
    const ccomp = parseFloat(creditsCompleted) || 45;
    const tc = parseFloat(targetCGPA);
    const crem = parseFloat(remainingCredits) || 75;

    if (isNaN(cc) || isNaN(ccomp) || isNaN(tc) || isNaN(crem)) return;

    const totalCredits = ccomp + (crem || 1);
    const currentPoints = cc * ccomp;
    const targetPoints = tc * totalCredits;
    const requiredPoints = targetPoints - currentPoints;
    const requiredSGPA = requiredPoints / (crem || 1);

    const gap = (tc - cc).toFixed(2);
    
    setResult({
      requiredSGPA: requiredSGPA.toFixed(2),
      gap: gap >= 0 ? `+${gap}` : gap,
      successRate: requiredSGPA <= 8.5 ? 'Very High' : requiredSGPA <= 9.0 ? 'High' : requiredSGPA <= 9.5 ? 'Possible' : 'Extreme',
      efficiency: `+${((requiredSGPA / cc - 1) * 100).toFixed(0)}%`,
      effort: requiredSGPA <= 8.5 ? 'Moderate' : requiredSGPA <= 9.2 ? 'Steady' : 'Advanced Effort'
    });
  };

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Target CGPA Calculator</h1>
        <p className="text-dim font-medium italic">Strategize your grades to achieve your academic milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Standing Card */}
          <div className="card border-orange-500/5 group hover:border-orange-500/20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white text-lg lowercase tracking-tight">Current Standing</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Current CGPA</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={currentCGPA}
                    onChange={(e) => setCurrentCGPA(e.target.value)}
                    className="input-field text-xl font-bold h-16"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-dim font-bold">/ 10.00</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Credits Completed</label>
                <input 
                  type="number"
                  value={creditsCompleted}
                  placeholder="45"
                  onChange={(e) => setCreditsCompleted(e.target.value)}
                  className="input-field text-xl font-bold h-16"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Target CGPA</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(e.target.value)}
                    className="input-field text-xl font-bold h-16 border-orange-500/30 focus:border-orange-500/60 ring-orange-500/10"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-400 font-bold text-xs uppercase tracking-widest">Goal</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Remaining Credits</label>
                <input 
                  type="number"
                  value={remainingCredits}
                  placeholder="75"
                  onChange={(e) => setRemainingCredits(e.target.value)}
                  className="input-field text-xl font-bold h-16"
                />
              </div>
            </div>

            <div className="h-px bg-white/5 w-full my-10" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xs text-dim font-medium max-w-sm text-center md:text-left">
                Suggested breakdown for remaining semesters based on credit weighting.
              </p>
              <button 
                onClick={calculatePath}
                className="btn-primary px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none shadow-orange-500/20 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-transform active:scale-95"
              >
                Calculate Path
                <Zap className="w-4 h-4 text-white fill-current" />
              </button>
            </div>
          </div>

          {/* Efficiency & Difficulty Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="card p-5 flex items-center gap-6 border-emerald-500/10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-black tracking-widest text-dim mb-1">Efficiency Need</p>
                   <p className="text-2xl font-black text-white">{result.efficiency} <span className="text-lg opacity-50">Higher GPA</span></p>
                </div>
             </div>

             <div className="card p-5 flex items-center gap-6 border-orange-500/10">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                   <Gauge className="w-7 h-7" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-black tracking-widest text-dim mb-1">Difficulty Tier</p>
                   <p className="text-2xl font-black text-white">{result.effort}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
           {/* Results Card */}
           <div className="card flex flex-col items-center">
              <div className="w-full mb-8">
                 <h3 className="text-lg font-black text-white tracking-tight">Required SGPA</h3>
                 <p className="text-[10px] font-bold text-dim uppercase tracking-widest mt-1">Future target average</p>
              </div>

              {/* Custom Gauge SVG */}
              <div className="relative w-56 h-56 mb-10">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="112" cy="112" r="95" stroke="rgba(255,255,255,0.05)" strokeWidth="16" fill="transparent" />
                    <circle cx="112" cy="112" r="95" stroke="#f97316" strokeWidth="16" fill="transparent" 
                      strokeDasharray="596.6" strokeDashoffset={596.6 - (Math.min(parseFloat(result.requiredSGPA) / 10, 1) * 596.6)} 
                      strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-glow" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white leading-none">{result.requiredSGPA}</span>
                    <span className="text-[10px] font-black text-dim uppercase tracking-widest mt-3">Target SGPA</span>
                 </div>
              </div>

              <div className="w-full space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-xs font-bold text-dim">Current CGPA</span>
                    <span className="text-sm font-black text-white">{currentCGPA}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-xs font-bold text-dim">Gap to Target</span>
                    <span className={`text-sm font-black ${parseFloat(result.gap) >= 0 ? 'text-orange-400' : 'text-emerald-400'}`}>{result.gap}</span>
                 </div>
                 <div className="flex justify-between items-center py-3">
                    <span className="text-xs font-bold text-dim">Success Rate</span>
                    <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">{result.successRate}</span>
                 </div>
              </div>
           </div>

           {/* Smart Insight Card */}
           <div className="card bg-[#0a111f] border-orange-500/10 p-6 space-y-6">
              <div className="flex items-center gap-3">
                 <Lightbulb className="w-6 h-6 text-orange-400" />
                 <h3 className="text-md font-black text-white">Smart Insight</h3>
              </div>
              <p className="text-sm text-dim leading-relaxed font-medium italic">
                To hit your target, focus on 4-credit courses this semester. An 'A' in a heavy credit course has more impact than in smaller electives.
              </p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors">
                View Credit Weighting
                <ChevronRight className="w-3 h-3" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
