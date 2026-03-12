import { useState } from 'react';
import TodoItem from '../components/TodoItem';
import { Plus, Filter, CheckCircle2 } from 'lucide-react';

let nextId = 4;
const initial = [
  { id: 1, text: 'Complete OS Assignment',     priority: 'high',   completed: false },
  { id: 2, text: 'Revise DBMS Chapter 4-6',    priority: 'medium', completed: true  },
  { id: 3, text: 'Submit CN Lab Report',       priority: 'high',   completed: false },
];

export default function TodoList() {
  const [tasks, setTasks]   = useState(initial);
  const [input, setInput]   = useState('');
  const [priority, setPri]  = useState('medium');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((t) => [...t, { id: nextId++, text, priority, completed: false }]);
    setInput('');
  };

  const toggle = (id) => setTasks((t) => t.map((x) => x.id === id ? { ...x, completed: !x.completed } : x));
  const remove = (id) => setTasks((t) => t.filter((x) => x.id !== id));

  const visible = tasks.filter((t) =>
    filter === 'all'       ? true :
    filter === 'active'    ? !t.completed :
    filter === 'completed' ? t.completed : true
  );

  const done  = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Progress header */}
      <div className="card p-5 flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-xl shadow-sm">
          {pct}%
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{done} of {total} tasks completed</p>
          <div className="progress-bar mt-2">
            <div className="progress-fill gradient-teal" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4" /> {done} done
        </div>
      </div>

      {/* Add task */}
      <div className="card space-y-3">
        <h2 className="font-bold text-slate-700 text-sm">Add New Task</h2>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Type a task and press Enter…"
            className="input-field flex-1"
          />
          <select
            value={priority}
            onChange={(e) => setPri(e.target.value)}
            className="input-field w-32"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={addTask} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === f ? 'gradient-primary text-white shadow-sm' : 'bg-white text-slate-500 border border-surface-200 hover:bg-surface-50'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{visible.length} tasks</span>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {visible.length === 0
          ? (
            <div className="card text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No tasks here!</p>
              <p className="text-sm mt-1">Add a task above to get started.</p>
            </div>
          )
          : visible.map((task) => (
            <TodoItem key={task.id} task={task} onToggle={toggle} onDelete={remove} />
          ))
        }
      </div>
    </div>
  );
}
