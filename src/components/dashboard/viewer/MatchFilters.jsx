const MatchFilters = ({ activeFilter, onChange }) => {
  const filters = ["ALL", "LIVE", "UPCOMING", "COMPLETED", "ABANDONED", "POSTPONED"];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-4 py-1 rounded-full border transition
            ${
              activeFilter === filter
                ? "bg-blue-600 text-white"
                : "dark:border-gray-600 dark:text-white hover:bg-blue-600 hover:text-white"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default MatchFilters;

