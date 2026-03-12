export default function StatCard({ title, value, subtitle, icon: Icon, gradient = 'gradient-primary', textColor = 'text-white' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 shadow-card ${gradient} text-white animate-fade-in`}>
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-white/5"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-white/70">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
