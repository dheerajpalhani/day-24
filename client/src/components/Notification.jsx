const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const base = 'rounded-xl border px-4 py-3 text-sm shadow-sm';
  const variants = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-rose-200 bg-rose-50 text-rose-700',
    info: 'border-sky-200 bg-sky-50 text-sky-700',
  };

  return (
    <div className={`${base} ${variants[type] || variants.info}`}>
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="font-semibold">×</button>
      </div>
    </div>
  );
};

export default Notification;
