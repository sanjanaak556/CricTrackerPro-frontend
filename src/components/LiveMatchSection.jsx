import React, { useState, useEffect } from "react";
import { PlayCircle, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LiveMatchSection = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const data = await api.get("/matches/public/live");
        // Show only up to 2 recent live matches
        setLiveMatches(data.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch live matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Live Matches
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching the latest cricket action...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (liveMatches.length === 0) {
    return null; // Don't show section if no live matches
  }

  return (
    <section id="live-matches" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white mb-6 shadow-lg">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-bold tracking-wide">LIVE NOW</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">Live Cricket</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
              Action Center
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the thrill of live cricket with real-time scores and updates
          </p>
        </div>

        {/* Live Matches Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {liveMatches.map((match) => (
            <div
              key={match._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 overflow-hidden hover:-translate-y-1"
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 via-orange-50/10 to-yellow-50/20 dark:from-red-900/10 dark:via-orange-900/5 dark:to-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Live Badge */}
              <div className="relative px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 tracking-wide">
                      LIVE MATCH
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{match.matchType}</span>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg">
                        {match.teamA?.logo ? (
                          <img
                            src={match.teamA.logo}
                            alt={match.teamA.name}
                            className="w-12 h-12 rounded-3xl object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {(match.teamA?.shortName || match.teamA?.name || "A").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {match.teamA?.shortName || match.teamA?.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Team A
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-lg">
                      <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">VS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {match.teamB?.shortName || match.teamB?.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Team B
                      </p>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg">
                        {match.teamB?.logo ? (
                          <img
                            src={match.teamB.logo}
                            alt={match.teamB.name}
                            className="w-12 h-12 rounded-3xl object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {(match.teamB?.shortName || match.teamB?.name || "B").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-wider">
                      {match.currentScore?.runs ?? 0}
                      <span className="text-2xl font-bold text-red-500 mx-2">/</span>
                      <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {match.currentScore?.wickets ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Overs: {match.currentScore?.overs ?? "0.0"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Watch Button */}
                <button
                  onClick={() => navigate("/register")}
                  className={`w-full py-4 flex items-center justify-center gap-3
                             text-white font-bold rounded-xl shadow-lg
                             bg-gradient-to-r from-red-600 via-red-500 to-orange-500
                             hover:from-red-700 hover:via-red-600 hover:to-orange-600
                             hover:shadow-2xl hover:shadow-red-500/30
                             transition-all duration-300 group transform hover:scale-[1.02]`}
                >
                  <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Watch Live Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveMatchSection;
