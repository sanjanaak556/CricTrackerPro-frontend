import { Activity } from "lucide-react";

export default function ActivityFeed({ activities = [] }) {

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

      <ul className="space-y-3">
        {activities.map((activity, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <Activity className="w-5 h-5 text-blue-500" />
            <span>{activity.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
