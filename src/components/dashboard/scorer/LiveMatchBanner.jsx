import { useNavigate } from "react-router-dom";

export default function LiveMatchBanner({ match }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Match Info */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          LIVE MATCH
        </div>

        <div className="flex items-center gap-3 text-xl font-bold">
          {match.teamA?.logo && (
            <img
              src={match.teamA.logo}
              alt={match.teamA.name}
              className="w-12 h-12 rounded-full bg-white p-1"
            />
          )}
          <span>{match.teamA?.name}</span>
          <span className="text-sm opacity-90">vs</span>
          <span>{match.teamB?.name}</span>
          {match.teamB?.logo && (
            <img
              src={match.teamB.logo}
              alt={match.teamB.name}
              className="w-12 h-12 rounded-full bg-white p-1"
            />
          )}
        </div>

        <p className="text-sm opacity-90 mt-1">
          {match.matchType} • {match.venue?.name}
          {match.venue?.city ? `, ${match.venue.city}` : ""}
        </p>

        {match.currentScore && (
          <p className="mt-2 text-sm font-medium">
            Score: {match.currentScore.runs}/
            {match.currentScore.wickets} (
            {match.currentScore.overs} ov)
          </p>
        )}
      </div>

      {/* Action */}
      <button
        onClick={() => navigate(`/scorer/live/${match._id}`)}
        className="bg-white text-red-600 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition self-start md:self-auto cursor-pointer"
      >
        Continue Scoring
      </button>
    </div>
  );
}
