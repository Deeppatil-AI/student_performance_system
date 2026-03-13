import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="h-20 flex items-center px-8 gap-8 relative z-20 bg-dark-900/40 backdrop-blur-xl border-b border-white/5">
      {/* Search Bar - Extended as per mockup */}
      <div className="flex-1">
        <div className="relative group max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, devs, or reports..."
            className="w-full bg-dark-800/50 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl bg-dark-800/50 border border-white/10 text-dim hover:text-white hover:bg-dark-700 transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-dark-900 group-hover:animate-ping shadow-blue-sm" />
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-white/5 mx-1" />

        {/* User Profile - Matching Mockup Order: Name (left), Avatar (right) */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="text-right flex flex-col justify-center">
            <p className="text-sm font-black text-white leading-tight group-hover:text-blue-400 transition-colors">Rahul Sharma</p>
            <p className="text-[10px] font-black text-dim uppercase tracking-widest mt-0.5">Artificial Intelligence</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-700 to-dark-800 border border-white/10 p-0.5 overflow-hidden transition-all group-hover:scale-105 group-hover:border-blue-500/50 shadow-lg">
              <div className="w-full h-full rounded-lg bg-dark-900 flex items-center justify-center text-blue-400 font-black text-xs">
                 RS
              </div>
            </div>
            {/* Online Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-900 shadow-glow shadow-emerald-500/20" />
          </div>
        </div>
      </div>
    </header>
  );
}
