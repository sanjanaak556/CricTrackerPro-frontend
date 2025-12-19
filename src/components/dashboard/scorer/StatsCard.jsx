export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  animate = false,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-lg ${color} ${
            animate ? "animate-pulse" : ""
          }`}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
