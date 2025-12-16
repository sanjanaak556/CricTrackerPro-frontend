import { useState } from "react";
import { Clock, CalendarDays, ChevronRight } from "lucide-react";

export default function MatchHistory() {
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "All" },
    { key: "won", label: "Won" },
    { key: "lost", label: "Lost" },
    { key: "tied", label: "Tied" },
    { key: "abandoned", label: "Abandoned" }
  ];

  const matches = [
    {
      id: 1,
      teamA: "Team Alpha",
      teamB: "Team Beta",
      result: "Team Alpha won by 20 runs",
      date: "2025-02-10",
      time: "4:00 PM",
      status: "won",
    },
    {
      id: 2,
      teamA: "Team Titans",
      teamB: "Team Warriors",
      result: "Match tied",
      date: "2025-02-11",
      time: "6:00 PM",
      status: "tied",
    },
  ];

  const filteredMatches =
    filter === "all" ? matches : matches.filter((m) => m.status === filter);

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-3xl font-bold">Match History</h1>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl border transition ${
              filter === f.key ? "bg-white text-black border-white" : "border-gray-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="p-5 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-gray-700 hover:scale-[1.02] transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">{match.teamA} vs {match.teamB}</h2>
              <ChevronRight />
            </div>

            <p className="text-gray-300">{match.result}</p>

            <div className="flex items-center gap-3 mt-3 text-gray-400">
              <CalendarDays className="w-4 h-4" /> {match.date}
              <Clock className="w-4 h-4 ml-4" /> {match.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





// import { useEffect, useState } from "react";
// import { Clock, CalendarDays, ChevronRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// export default function MatchHistory() {
//   const [matches, setMatches] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const filters = [
//     { key: "all", label: "All" },
//     { key: "completed", label: "Completed" },
//     { key: "tied", label: "Tied" },
//     { key: "abandoned", label: "Abandoned" },
//   ];

//   /* -----------------------------
//       FETCH MATCH HISTORY
//   ----------------------------- */
//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const res = await api.get("/matches");
//         setMatches(res);
//       } catch (err) {
//         console.error("Failed to fetch match history", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatches();
//   }, []);

//   const filteredMatches =
//     filter === "all"
//       ? matches
//       : matches.filter((m) => m.status === filter);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6 text-white">
//       <h1 className="text-3xl font-bold">Match History</h1>

//       {/* Filters */}
//       <div className="flex gap-3 flex-wrap">
//         {filters.map((f) => (
//           <button
//             key={f.key}
//             onClick={() => setFilter(f.key)}
//             className={`px-4 py-2 rounded-xl border transition ${
//               filter === f.key
//                 ? "bg-white text-black border-white"
//                 : "border-gray-500"
//             }`}
//           >
//             {f.label}
//           </button>
//         ))}
//       </div>

//       {/* Match Cards */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {filteredMatches.map((match) => (
//           <div
//             key={match._id}
//             onClick={() =>
//               navigate(`/viewer/match-summary/${match._id}`)
//             }
//             className="cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-gray-700 hover:scale-[1.02] transition"
//           >
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-xl font-semibold">
//                 {match.teamA?.name} vs {match.teamB?.name}
//               </h2>
//               <ChevronRight />
//             </div>

//             <p className="text-gray-300">
//               {match.resultText || "Result not available"}
//             </p>

//             <div className="flex items-center gap-3 mt-3 text-gray-400">
//               <CalendarDays className="w-4 h-4" />
//               {new Date(match.scheduledAt).toDateString()}
//               <Clock className="w-4 h-4 ml-4" />
//               {new Date(match.scheduledAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
