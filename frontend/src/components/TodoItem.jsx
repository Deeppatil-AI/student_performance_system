import { Check, Trash2 } from 'lucide-react';

export default function TodoItem({ task, onToggle, onDelete }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 group animate-fade-in
      ${task.completed
        ? 'bg-surface-50 border-surface-200 opacity-70'
        : 'bg-white border-surface-200 hover:border-primary-300 hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${task.completed
            ? 'bg-primary-600 border-primary-600'
            : 'border-surface-300 hover:border-primary-400'
          }`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
          {task.text}
        </p>
        {task.dueDate && (
          <p className="text-xs text-slate-400 mt-0.5">{task.dueDate}</p>
        )}
      </div>

      {/* Priority badge */}
      {task.priority && (
        <span className={`stat-badge text-xs flex-shrink-0 ${
          task.priority === 'high'   ? 'bg-red-100 text-red-600' :
          task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                                       'bg-green-100 text-green-600'
        }`}>
          {task.priority}
        </span>
      )}

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
