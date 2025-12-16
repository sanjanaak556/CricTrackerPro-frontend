import React, { useEffect, useState } from "react";
import HeroSection from "../../components/dashboard/viewer/HeroSection";
import QuickStats from "../../components/dashboard/viewer/QuickStats";
import LiveMatchCard from "../../components/dashboard/viewer/LiveMatchCard";
import api from "../../services/api";
import { Bell, Calendar, Clock, ChevronRight, ShieldAlert } from "lucide-react";

const ViewerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);

  const [followedLive, setFollowedLive] = useState([]);
  const [followedUpcoming, setFollowedUpcoming] = useState([]);
  const [followedRecent, setFollowedRecent] = useState([]);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // 1) FETCH DASHBOARD HIGHLIGHTS
  // ---------------------------------------------------------
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/viewer/dashboard");
        console.log("DASHBOARD HIGHLIGHTS:", res);
        setDashboard(res);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard highlights.");
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  // ---------------------------------------------------------
  // 2) FETCH DASHBOARD STATS (NEW)
  // ---------------------------------------------------------
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const res = await api.get("/viewer/dashboard/stats");
        console.log("DASHBOARD STATS:", res);
        setDashboardStats(res);
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardStats();
  }, []);

  // ---------------------------------------------------------
  // 3) FETCH LIVE MATCHES
  // ---------------------------------------------------------
  useEffect(() => {
    const loadLiveMatches = async () => {
      try {
        const res = await api.get("/matches/live");
        console.log("LIVE MATCHES:", res);
        setLiveMatches(res || []);
      } catch (err) {
        console.error("Live match fetch error:", err);
        setError("Failed to load live matches.");
      } finally {
        setLoadingMatches(false);
      }
    };

    loadLiveMatches();
  }, []);

  // ---------------------------------------------------------
  // 4) FETCH FOLLOWED TEAMS ACTIVITY
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchFollowedTeamsActivity = async () => {
      try {
        const res = await api.get("/viewer/followed/activity");
        console.log("FOLLOWED TEAMS ACTIVITY:", res);

        setFollowedLive(res.liveMatches || []);
        setFollowedUpcoming(res.upcomingMatches || []);
        setFollowedRecent(res.recentMatches || []);
      } catch (err) {
        console.error("Followed teams fetch error:", err);
      }
    };

    fetchFollowedTeamsActivity();
  }, []);

  const Spinner = () => (
    <div className="w-full flex justify-center py-6">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Hero */}
      <HeroSection />

      {/* Quick Stats */}
      {loadingDashboard ? <Spinner /> : <QuickStats stats={dashboardStats} />}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Highlights */}
      <div>
        <h2 className="text-xl font-semibold mb-3 dark:text-white flex items-center justify-between">
          Highlights
          <span className="text-xs text-gray-500">
            Latest from recent matches
          </span>
        </h2>

        {loadingDashboard ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard?.highlights?.length ? (
              dashboard.highlights.map((m) => (
                <div
                  key={m._id}
                  className="p-4 rounded-xl bg-white dark:bg-gray-900 border shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() =>
                    m.status !== "abandoned" &&
                    (window.location.href = `/match-summary/${m._id}`)
                  }
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Team A */}
                    <div className="flex items-center gap-3">
                      <img
                        src={m.teamA.logo}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <p className="font-semibold dark:text-white">
                        {m.teamA.name}
                      </p>
                    </div>
                    <p className="font-bold text-gray-400">VS</p>
                    {/* Team B */}
                    <div className="flex items-center gap-3">
                      <p className="font-semibold dark:text-white">
                        {m.teamB.name}
                      </p>
                      <img
                        src={m.teamB.logo}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {m.status === "abandoned" ? (
                    <p className="mt-3 text-red-500 font-medium">
                      Match Abandoned
                    </p>
                  ) : (
                    <>
                      <p className="mt-3 text-blue-600 dark:text-blue-400 font-medium">
                        {m.result}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Winner:{" "}
                        <span className="font-semibold">{m.winner}</span>
                      </p>
                      {m.winMargin && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Margin: {m.winMargin}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No highlights available.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ⭐ Followed Teams Activity (Styled + Lucide Icons) */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-yellow-400" />
          Followed Teams Activity
        </h2>

        {/* Empty State */}
        {followedLive.length === 0 &&
          followedUpcoming.length === 0 &&
          followedRecent.length === 0 && (
            <div className="bg-gray-800/40 border border-gray-700 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl">
              <ShieldAlert className="w-20 h-20 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white">
                No Updates Yet
              </h3>
              <p className="text-gray-400 mt-2">
                Upcoming or recent matches of the teams you follow will appear
                here.
              </p>
            </div>
          )}

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ...followedLive.map((m) => ({ ...m, status: "live" })),
            ...followedUpcoming.map((m) => ({ ...m, status: "upcoming" })),
            ...followedRecent.map((m) => ({ ...m, status: "recent" })),
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 
        rounded-2xl border border-gray-700 shadow-lg 
        hover:scale-[1.02] hover:border-yellow-500/40 
        transition-all cursor-pointer group backdrop-blur-xl"
            >
              {/* Team Logos */}
              <div className="flex items-center justify-between mb-6">
                {/* Logos group */}
                <div className="flex items-center">
                  <img
                    src={item.teamA.logo}
                    className="w-12 h-12 rounded-full border-2 border-gray-700 bg-gray-900 z-10 group-hover:scale-105 transition-transform"
                  />
                  <img
                    src={item.teamB.logo}
                    className="w-12 h-12 rounded-full border-2 border-gray-700 bg-gray-900 -ml-4 group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition" />
              </div>

              {/* Team Names */}
              <div className="text-white font-semibold text-lg">
                {item.teamA.name} <span className="text-gray-400">vs</span>{" "}
                {item.teamB.name}
              </div>

              {/* Date + Time */}
              {item.scheduledAt && (
                <div className="mt-3 text-sm text-gray-300 space-y-2">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    {new Date(item.scheduledAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    {new Date(item.scheduledAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div
                className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium 
    ${
      item.status === "live"
        ? "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse"
        : item.status === "upcoming"
        ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
        : "bg-green-500/20 text-green-300 border border-green-500/40"
    }`}
              >
                {item.status === "live"
                  ? "LIVE NOW"
                  : item.status === "upcoming"
                  ? "Upcoming Match"
                  : "Recently Played"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Matches */}
      <div>
        <h2 className="text-xl font-semibold mb-3 dark:text-white">
          Live Matches
        </h2>

        {loadingMatches ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.length > 0 ? (
              liveMatches.map((match) => (
                <LiveMatchCard key={match._id} match={match} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No live matches right now.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerDashboard;
