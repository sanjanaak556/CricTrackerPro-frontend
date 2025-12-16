import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function ViewReportDetails() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX: Absolute backend URL prevents React Router errors
  const backendURL = "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/match-summary/summary/${reportId}`);
      const data = res?.data ?? res;
      setReport(data);
    } catch (err) {
      console.error("Failed to load report:", err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  if (!report)
    return (
      <div className="text-center py-20 text-gray-500">Report not found</div>
    );

  return (
    <div className="space-y-6">
      <Link
        to="/admin/reports"
        className="inline-flex items-center text-blue-600 dark:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </Link>

      <h1 className="text-2xl font-bold dark:text-white">
        Match Report Details
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <div>
          <h2 className="text-lg font-semibold dark:text-white">
            {report.match?.matchName ?? `Match #${report.matchNumber ?? ""}`}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {report.match?.venue?.name ?? report.venue?.name ?? ""}
            {report.match?.venue?.city
              ? `, ${report.match.venue.city}`
              : report.venue?.city
              ? `, ${report.venue.city}`
              : ""}
          </p>
        </div>

        <div>
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            <strong>Result:</strong> {report.resultText}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            <strong>Winner:</strong>{" "}
            {report.winnerTeamId?.name ?? report.winnerName ?? "—"}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            <strong>By:</strong> {report.winType}{" "}
            {report.winMargin ? `by ${report.winMargin}` : ""}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            <strong>Player of the Match:</strong>{" "}
            {report.playerOfTheMatch?.name ?? "—"}
          </p>
        </div>

        {/* Innings Breakdown */}
        {Array.isArray(report.inningsDetails) &&
          report.inningsDetails.length > 0 && (
            <div className="space-y-4">
              {report.inningsDetails.map((inn, idx) => (
                <div
                  key={inn.inningsId || idx}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <h3 className="font-semibold dark:text-white">
                    Innings {idx + 1} — {inn.teamId?.name ?? "Team"}
                  </h3>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Runs: {inn.runs} • Wickets: {inn.wickets} • Overs:{" "}
                    {inn.overs}
                  </div>

                  {/* Batter Stats */}
                  {inn.batterStats && (
                    <div className="mt-2">
                      <div className="font-medium dark:text-white">
                        Batter Stats
                      </div>
                      <div className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                        {Array.isArray(inn.batterStats)
                          ? inn.batterStats.map((b, i) => (
                              <div key={i}>
                                {b.name} — {b.runs} ({b.balls})
                              </div>
                            ))
                          : Object.values(inn.batterStats).map((b, i) => (
                              <div key={i}>
                                {b.name} — {b.runs} ({b.balls})
                              </div>
                            ))}
                      </div>
                    </div>
                  )}

                  {/* Bowler Stats */}
                  {inn.bowlerStats && (
                    <div className="mt-2">
                      <div className="font-medium dark:text-white">
                        Bowler Stats
                      </div>
                      <div className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                        {Array.isArray(inn.bowlerStats)
                          ? inn.bowlerStats.map((b, i) => (
                              <div key={i}>
                                {b.name} — {b.wickets} wkts ({b.overs} overs)
                              </div>
                            ))
                          : Object.values(inn.bowlerStats).map((b, i) => (
                              <div key={i}>
                                {b.name} — {b.wickets} wkts ({b.overs} overs)
                              </div>
                            ))}
                      </div>
                    </div>
                  )}

                  {/* Fall of Wickets */}
                  {inn.fallOfWickets && inn.fallOfWickets.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium dark:text-white">
                        Fall of Wickets
                      </div>
                      <div className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                        {inn.fallOfWickets.map((f, i) => (
                          <div key={i}>
                            {f.wicketNumber}.{" "}
                            {f.playerId?.name ?? f.playerName ?? "Player"} —{" "}
                            {f.scoreAtFall} ({f.overAtFall})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* 🔥 FIXED PDF DOWNLOAD BUTTON */}
        <div>
          <a
            href={`http://localhost:5000/api/match-summary/${
              report.matchId || report._id
            }/pdf?token=${token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
