export default function RecentMatchesTable({ matches = [] }) {

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Matches</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="py-2">#</th>
            <th className="py-2">Teams</th>
            <th className="py-2">Status</th>
            <th className="py-2">Result</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {matches.map((m, index) => (
            <tr
              key={m._id}
              className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <td className="py-3">{index + 1}</td>
              <td>{`${m.teamA.name} vs ${m.teamB.name}`}</td>
              <td>
                <span
                  className={`
                    px-2 py-1 rounded text-sm
                    ${m.status === "completed"
                      ? "bg-green-200 text-green-700"
                      : m.status === "live"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-300 text-gray-800"
                    }
                  `}
                >
                  {m.status}
                </span>
              </td>
              <td>{m.result}</td>
              <td className="py-3">
                {m.status === "upcoming" && (
                  <button className="text-blue-600 hover:text-blue-700 cursor-pointer">View Details</button>
                )}
                {m.status === "live" && (
                  <button className="text-green-600 hover:text-green-700 cursor-pointer">View Live</button>
                )}
                {m.status === "completed" && (
                  <button className="text-purple-600 hover:text-purple-700 cursor-pointer">View Report</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
