import React from "react";
import { Activity, Radio, Heart } from "lucide-react";

const QuickStats = ({ stats }) => {
  if (!stats) return null;

  const data = [
    {
      label: "Today's Matches",
      value: stats.todaysMatches,
      icon: <Activity size={22} />,
    },
    {
      label: "Live Now",
      value: stats.liveMatches,
      icon: <Radio size={22} />,
    },
    {
      label: "Followed Teams",
      value: stats.followedTeams,
      icon: <Heart size={22} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {data.map((stat, index) => (
        <div
          key={index}
          className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow"
        >
          <div className="flex items-center gap-3">
            {stat.icon}
            <p className="text-sm">{stat.label}</p>
          </div>
          <h3 className="text-2xl font-bold">{stat.value ?? 0}</h3>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
