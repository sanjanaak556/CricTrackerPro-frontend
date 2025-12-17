import React from "react";
import { Activity, Radio, Heart } from "lucide-react";

const QuickStats = ({ stats }) => {
  if (!stats) return null;

  const data = [
    {
      label: "Today's Matches",
      value: stats.todaysMatches,
      icon: <Activity size={22} />,
      color: "bg-green-500",
    },
    {
      label: "Live Now",
      value: stats.liveMatches,
      icon: <Radio size={22} />,
      color: "bg-purple-500",
    },
    {
      label: "Followed Teams",
      value: stats.followedTeams,
      icon: <Heart size={22} />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {data.map((stat, index) => (
        <div
          key={index}
          className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center gap-4"
        >
          {/* COLORED ICON BOX */}
          <div className={`p-3 rounded-lg text-white ${stat.color}`}>
            {stat.icon}
          </div>

          {/* TEXT CONTENT */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold">{stat.value ?? 0}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
