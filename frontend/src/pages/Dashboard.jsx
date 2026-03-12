import { Link } from 'react-router-dom';
import {
  Timer, CheckSquare, BookOpen, TrendingUp, Code2,
  Clock, Target, Flame, BookMarked, ArrowRight, Star,
} from 'lucide-react';
import StatCard from '../components/StatCard';

const summaryCards = [
  { title: 'Study Hours Today', value: '3h 25m', subtitle: 'Goal: 5 hours',     icon: Clock,   gradient: 'gradient-primary' },
  { title: 'Tasks Completed',   value: '7/12',  subtitle: '5 tasks remaining',  icon: CheckSquare, gradient: 'gradient-teal' },
  { title: 'Avg Attendance',    value: '82%',   subtitle: 'Above 75% threshold', icon: BookOpen, gradient: 'gradient-amber' },
  { title: 'Current CGPA',      value: '8.4',   subtitle: 'Target: 9.0',         icon: TrendingUp, gradient: 'gradient-rose' },
];

const quickLinks = [
  { to: '/timer',      icon: Timer,       label: 'Study Timer',     sub: 'Start a focus session', color: 'text-primary-600 bg-primary-50' },
  { to: '/todo',       icon: CheckSquare, label: 'To-Do List',       sub: '5 tasks pending',       color: 'text-teal-600 bg-teal-50' },
  { to: '/attendance', icon: BookOpen,    label: 'Attendance',       sub: '82% overall',           color: 'text-amber-600 bg-amber-50' },
  { to: '/cgpa',       icon: TrendingUp,  label: 'CGPA Calculator',  sub: 'Plan your semester',    color: 'text-rose-600 bg-rose-50' },
  { to: '/coding',     icon: Code2,       label: 'Coding Activity',  sub: '🔥 7 day streak',       color: 'text-violet-600 bg-violet-50' },
];

const recentActivity = [
  { icon: Timer,  label: 'Completed 25-min focus session',   time: '2 hrs ago',  color: 'text-primary-500 bg-primary-50' },
  { icon: CheckSquare, label: 'Marked "OS Assignment" done', time: '4 hrs ago',  color: 'text-teal-500 bg-teal-50' },
  { icon: Code2,  label: 'Solved 3 problems on LeetCode',    time: 'Yesterday',  color: 'text-violet-500 bg-violet-50' },
  { icon: BookOpen, label: 'Attendance marked for DBMS',     time: 'Yesterday',  color: 'text-amber-500 bg-amber-50' },
  { icon: Star,   label: 'Updated CGPA target to 9.0',       time: '2 days ago', color: 'text-rose-500 bg-rose-50' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 shadow-card-lg">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5"></div>
        <div className="relative z-10">
          <p className="text-primary-200 text-sm font-medium mb-1">Good Evening 👋</p>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Student!</h1>
          <p className="text-primary-200 text-sm max-w-md">
            You've studied <strong className="text-white">3h 25m</strong> today. Keep it up — only 1h 35m to hit your daily goal!
          </p>
        </div>
        <div className="relative z-10 mt-5 flex gap-3">
          <Link to="/timer" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors shadow-sm">
            <Timer className="w-4 h-4" /> Start Studying
          </Link>
          <Link to="/todo" className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
            View Tasks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      {/* Quick links + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-bold text-slate-700 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map(({ to, icon: Icon, label, sub, color }) => (
              <Link
                key={to}
                to={to}
                className="card flex items-center gap-4 hover:shadow-card-lg group transition-all cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-base font-bold text-slate-700 mb-4">Recent Activity</h2>
          <div className="card space-y-3 p-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 leading-snug">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame,     label: 'Current Streak',  value: '7 days',  color: 'text-orange-500' },
          { icon: BookMarked,label: 'Subjects',         value: '6',       color: 'text-primary-500' },
          { icon: Target,    label: 'CGPA Target',      value: '9.0',     color: 'text-rose-500' },
          { icon: Code2,     label: 'Problems Solved',  value: '148',     color: 'text-violet-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <Icon className={`w-6 h-6 flex-shrink-0 ${color}`} />
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="font-bold text-slate-800">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
