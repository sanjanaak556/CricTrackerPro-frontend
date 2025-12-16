export default function RecentMatchesTable() {
  const matches = [
    {
      id: 1,
      teams: "Team A vs Team B",
      status: "Completed",
      result: "Team A won",
    },
    {
      id: 2,
      teams: "Team C vs Team D",
      status: "Ongoing",
      result: "Live Now",
    },
    {
      id: 3,
      teams: "Team E vs Team F",
      status: "Upcoming",
      result: "–",
    },
  ];

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
              key={m.id}
              className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <td className="py-3">{index + 1}</td>
              <td>{m.teams}</td>
              <td>
                <span
                  className={`
                    px-2 py-1 rounded text-sm
                    ${
                      m.status === "Completed"
                        ? "bg-green-200 text-green-700"
                        : m.status === "Ongoing"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-300 text-gray-800"
                    }
                  `}
                >
                  {m.status}
                </span>
              </td>
              <td>{m.result}</td>
              <td className="flex gap-3 py-3">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-green-600 hover:underline">Live</button>
                <button className="text-purple-600 hover:underline">
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
