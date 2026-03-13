import { useLocation } from 'react-router-dom';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="h-20 flex items-center px-8 gap-8 relative z-20 bg-dark-900/50 backdrop-blur-md border-b border-dark-700">
      {/* Search Bar - Centered like mockup */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, devs, or reports..."
            className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dim hover:text-white hover:bg-dark-700 transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-dark-800 group-hover:animate-ping" />
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-dark-700 mx-2" />

        {/* User Profile - Matching Mockup Layout */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-white leading-none">Rahul Sharma</p>
            <p className="text-[10px] font-bold text-dim uppercase tracking-widest mt-1">Student Lead</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden transition-transform group-hover:scale-110">
              <div className="w-full h-full rounded-full bg-dark-700 flex items-center justify-center text-blue-400 font-black text-sm">
                 RS
              </div>
            </div>
            {/* Online Status */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-900" />
          </div>
        </div>
      </div>
    </header>
  );
}
