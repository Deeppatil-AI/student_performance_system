export default function StatCard({ title, value, subtitle, icon: Icon, colorClass = 'text-orange-400', bgClass = 'bg-orange-500/10' }) {
  return (
    <div className="card hover:shadow-orange-md group border-orange-500/5 hover:border-orange-500/20">
      <div className="flex items-start gap-5">
        <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
          {Icon && <Icon className={`w-7 h-7 ${colorClass}`} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dim truncate uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-dim mt-2 flex items-center gap-1.5 capitalize">
              <span className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text', 'bg').replace('400', '500')}`} />
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
