const StatCard = ({ title, value, subtitle, accent }) => {
  const accentClasses = {
    blue: 'from-sky-500 to-cyan-400',
    purple: 'from-violet-500 to-fuchsia-400',
    green: 'from-emerald-500 to-lime-400',
    rose: 'from-rose-500 to-orange-400',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 h-2 w-20 rounded-full bg-gradient-to-r ${accentClasses[accent] || accentClasses.blue}`} />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
};

export default StatCard;
