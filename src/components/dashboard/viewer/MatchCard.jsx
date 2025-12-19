import { useNavigate } from "react-router-dom";
import { PlayCircle, Calendar, Eye, AlertTriangle } from "lucide-react";

const statusConfig = {
  live: {
    badge: "bg-red-500/20 text-red-600 border-red-500",
    label: "LIVE",
    button: "Watch Live",
    buttonIcon: <PlayCircle size={18} />,
    buttonStyle: "bg-red-600 hover:bg-red-700",
    route: (id) => `/viewer/match/live/${id}`,
  },
  upcoming: {
    badge: "bg-blue-500/20 text-blue-600 border-blue-500",
    label: "UPCOMING",
    button: "Match Preview",
    buttonIcon: <Calendar size={18} />,
    buttonStyle: "bg-blue-600 hover:bg-blue-700",
    route: (id) => `/viewer/match/preview/${id}`,
  },
  completed: {
    badge: "bg-green-500/20 text-green-600 border-green-500",
    label: "COMPLETED",
    button: "View Summary",
    buttonIcon: <Eye size={18} />,
    buttonStyle: "bg-green-600 hover:bg-green-700",
    route: (id) => `/viewer/match/summary/${id}`,
  },
  abandoned: {
    badge: "bg-gray-400/20 text-gray-500 border-gray-400",
    label: "ABANDONED",
    button: "Match Info",
    buttonIcon: <AlertTriangle size={18} />,
    buttonStyle: "bg-gray-500 hover:bg-gray-600",
    route: (id) => `/viewer/match/summary/${id}`,
  },
  postponed: {
    badge: "bg-orange-400/20 text-orange-500 border-orange-400",
    label: "POSTPONED",
    button: "New Schedule",
    buttonIcon: <Calendar size={18} />,
    buttonStyle: "bg-orange-500 hover:bg-orange-600",
    route: (id) => `/viewer/match/preview/${id}`,
  },
};

const MatchCard = ({ match }) => {
  const navigate = useNavigate();
  const config = statusConfig[match.status] || statusConfig.upcoming;

  const handleNavigate = () => {
    if (!match?._id) return;
    navigate(config.route(match._id));
  };

  return (
    <div
      className="p-5 rounded-2xl bg-white dark:bg-gray-900 
      border dark:border-gray-700 shadow-md 
      hover:shadow-xl transition-all hover:-translate-y-1"
    >
      {/* Status Badge */}
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold 
  rounded-full border ${config.badge}`}
      >
        {match.status === "live" && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
        )}
        {config.label}
      </span>

      {/* Teams */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <img src={match.teamA.logo} className="h-10 w-10 rounded" />
          <p className="font-semibold dark:text-white">{match.teamA.name}</p>
        </div>

        <span className="text-gray-400 font-bold">VS</span>

        <div className="flex items-center gap-3">
          <p className="font-semibold dark:text-white">{match.teamB.name}</p>
          <img src={match.teamB.logo} className="h-10 w-10 rounded" />
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-sm">
        {match.status === "upcoming" && (
          <p className="text-gray-500">
            🕒 {new Date(match.scheduledAt).toLocaleString()}
          </p>
        )}

        {match.status === "live" && (
          <p className="font-medium dark:text-white">
            {match.currentScore
              ? `${match.currentScore.runs}/${match.currentScore.wickets} (${match.currentScore.overs} ov)`
              : "Live score updating..."}
          </p>
        )}

        {match.status === "completed" && (
          <p className="text-gray-500">Result: {match.result}</p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleNavigate}
        className={`mt-5 w-full py-2 flex items-center justify-center gap-2 
        text-white rounded-xl font-semibold transition ${config.buttonStyle}`}
      >
        {config.buttonIcon}
        {config.button}
      </button>
    </div>
  );
};

export default MatchCard;
