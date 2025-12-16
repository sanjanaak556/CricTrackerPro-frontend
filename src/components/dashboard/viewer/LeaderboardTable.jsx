import React from "react";

const LeaderboardTable = ({ type, data }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow border dark:border-gray-700">
      <table className="w-full text-left bg-white dark:bg-gray-900">
        
        {/* Table Header */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {type === "teams" && (
              <>
                <th className="p-3">Rank</th>
                <th className="p-3">Team</th>
                <th className="p-3">Matches</th>
                <th className="p-3">Wins</th>
                <th className="p-3">Points</th>
              </>
            )}

            {type === "batters" && (
              <>
                <th className="p-3">Rank</th>
                <th className="p-3">Player</th>
                <th className="p-3">Team</th>
                <th className="p-3">Runs</th>
                <th className="p-3">Avg</th>
              </>
            )}

            {type === "bowlers" && (
              <>
                <th className="p-3">Rank</th>
                <th className="p-3">Player</th>
                <th className="p-3">Team</th>
                <th className="p-3">Wickets</th>
                <th className="p-3">Economy</th>
              </>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((item) => (
            <tr
              key={item.rank}
              className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="p-3 dark:text-white">{item.rank}</td>

              {type === "teams" && (
                <>
                  <td className="p-3 dark:text-white">{item.name}</td>
                  <td className="p-3 dark:text-white">{item.matches}</td>
                  <td className="p-3 dark:text-white">{item.wins}</td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                    {item.points}
                  </td>
                </>
              )}

              {type === "batters" && (
                <>
                  <td className="p-3 dark:text-white">{item.name}</td>
                  <td className="p-3 dark:text-white">{item.team}</td>
                  <td className="p-3 dark:text-white">{item.runs}</td>
                  <td className="p-3">{item.avg}</td>
                </>
              )}

              {type === "bowlers" && (
                <>
                  <td className="p-3 dark:text-white">{item.name}</td>
                  <td className="p-3 dark:text-white">{item.team}</td>
                  <td className="p-3 dark:text-white">{item.wickets}</td>
                  <td className="p-3">{item.eco}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
