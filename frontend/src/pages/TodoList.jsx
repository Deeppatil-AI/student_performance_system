import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  LayoutList, 
  ClipboardCheck, 
  Clock, 
  Target, 
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';

export default function TodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete OS Assignment', type: 'Academic', completed: false, date: 'Mar 14, 2026', priority: 'High' },
    { id: 2, text: 'Revise DBMS Chapter 4', type: 'Study', completed: true, date: 'Mar 13, 2026', priority: 'Medium' },
    { id: 3, text: 'Submit CN Lab Report', type: 'Academic', completed: false, date: 'Mar 14, 2026', priority: 'High' },
  ]);
  
  const [input, setInput] = useState('');
  const [type, setType] = useState('Daily Task');
  const [activeTab, setActiveTab] = useState('pending');

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  
  const visibleTasks = tasks.filter(t => 
    activeTab === 'pending' ? !t.completed : t.completed
  );

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input,
      type,
      completed: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      priority: 'Medium'
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-orange-md ring-1 ring-orange-400/30">
            <LayoutList className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">To-Do List</h1>
            <p className="text-dim mt-2 font-medium italic">Organize your academic goals and daily tasks.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-orange-500/10">
            <Target className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">{pendingCount} Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: New Goal Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-orange-500/5 group transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
              <Plus className="w-5 h-5 text-orange-400" />
              <h3 className="font-extrabold text-white text-sm uppercase tracking-widest">New Goal</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-400/70 ml-1">Description</label>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What needs to be done?"
                  className="input-field min-h-[140px] resize-none scrollbar-dark focus:ring-orange-500/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-400/70 ml-1">Goal Type</label>
                <div className="relative">
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="input-field appearance-none cursor-pointer pr-10"
                  >
                    <option value="Daily Task">Daily Task</option>
                    <option value="Academic Project">Academic Project</option>
                    <option value="Exam Preparation">Exam Prep</option>
                    <option value="Self Study">Self Study</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim rotate-90" />
                </div>
              </div>

              <button 
                onClick={addTask}
                className="btn-primary w-full py-4 text-xs uppercase font-black tracking-[0.2em] flex items-center justify-center gap-3 group transition-all"
              >
                Add Task
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="card bg-amber-500/5 border-amber-500/10 flex items-start gap-4 p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/70 leading-relaxed font-medium">
              Regularly updating your tasks helps in maintaining a 7-day coding streak and better CGPA management.
            </p>
          </div>
        </div>

        {/* Right Column: Task List */}
        <div className="lg:col-span-3 card min-h-[600px] flex flex-col p-0 overflow-hidden border-orange-500/5">
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-6 h-6 text-orange-400" />
              <h3 className="font-extrabold text-white text-lg lowercase tracking-tight">Your Tasks</h3>
            </div>
            
            <div className="flex p-1.5 bg-dark-900 border border-dark-700/50 rounded-2xl shadow-inner">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-dim hover:text-white'}`}
              >
                Pending ({pendingCount})
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-dim hover:text-white'}`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 space-y-4">
            {visibleTasks.length > 0 ? (
              visibleTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between overflow-hidden ${
                    task.completed 
                      ? 'bg-dark-800/20 border-white/5 opacity-60' 
                      : 'bg-dark-700/30 border-dark-600/50'
                  }`}
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                          ? 'bg-orange-600 border-orange-600 shadow-orange-sm' 
                          : 'border-dark-500 hover:border-orange-400 group-hover:bg-orange-500/10'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </button>
                    
                    <div className="space-y-1">
                      <p className={`font-bold text-sm md:text-base leading-tight transition-all ${task.completed ? 'text-dim line-through decoration-orange-500/40' : 'text-white'}`}>
                        {task.text}
                      </p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                        <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {task.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-dim font-bold">
                          <Clock className="w-3 h-3" />
                          {task.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative z-10">
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-3 rounded-xl bg-red-500/5 text-dim hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-500/20"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 py-20 animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-dark-900 flex items-center justify-center border border-dark-700 shadow-inner group">
                  <ClipboardCheck className="w-12 h-12 text-dim/20 group-hover:text-orange-500/30 transition-colors duration-500" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-white font-black text-lg tracking-tight">All caught up! Excellent work.</h4>
                  <p className="text-dim text-sm font-medium">No tasks found in this category.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
