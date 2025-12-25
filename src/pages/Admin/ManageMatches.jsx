import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import CreateMatchModal from "../../components/dashboard/admin/CreateMatchModal";
import EditMatchModal from "../../components/dashboard/admin/EditMatchModal";

function ManageMatches() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMatchId, setEditMatchId] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [matchesRes, teamsRes, usersRes] = await Promise.all([
        api.get("/matches"),
        api.get("/teams"),
        api.get("/users"),
      ]);
      
      setMatches(matchesRes || []);
      setTeams(Array.isArray(teamsRes) ? teamsRes : 
               teamsRes?.teams ? teamsRes.teams : 
               teamsRes?.data ? teamsRes.data : []);
      setUsers(Array.isArray(usersRes) ? usersRes : 
               usersRes?.users ? usersRes.users : 
               usersRes?.data ? usersRes.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await api.get(`/matches?status=${filter}`);
      setMatches(Array.isArray(response) ? response : 
                 response?.matches ? response.matches : 
                 response?.data ? response.data : []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleCreateMatch = async (formData) => {
    try {
      await api.post("/matches", formData);
      setShowCreateModal(false);
      fetchMatches();
    } catch (error) {
      console.error("Error creating match:", error);
      throw error;
    }
  };

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setEditMatchId(match._id);
    setShowEditModal(true);
  };

  const handleUpdateMatch = async (formData) => {
    try {
      await api.put(`/matches/${editMatchId}`, formData);
      setShowEditModal(false);
      setEditMatchId(null);
      setSelectedMatch(null);
      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
      throw error;
    }
  };

  const handleEndMatch = async (matchId) => {
    try {
      await api.put(`/matches/${matchId}/complete`);
      fetchMatches();
    } catch (error) {
      console.error("Error ending match:", error);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await api.delete(`/matches/${matchId}`);
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const handleViewLive = (matchId) => navigate(`/viewer/live/${matchId}`);
  const handleViewSummary = (matchId) =>
    navigate(`/viewer/scorecard/${matchId}`);

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "live":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "completed":
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const scorers = users.filter((u) => u.role?.roleName === "scorer");

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Manage Matches
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Match
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex space-x-2">
        {["all", "upcoming", "live", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* CREATE MATCH MODAL */}
      <CreateMatchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMatch}
        teams={teams}
        scorers={scorers}
      />

      {/* EDIT MATCH MODAL */}
      {selectedMatch && (
        <EditMatchModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMatch(null);
            setEditMatchId(null);
          }}
          onSubmit={handleUpdateMatch}
          match={selectedMatch}
          teams={teams}
          scorers={scorers}
        />
      )}

      {/* MATCHES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match._id}
            match={match}
            onEdit={handleEditClick}
            onDelete={handleDeleteMatch}
            onEndMatch={handleEndMatch}
            onViewLive={handleViewLive}
            onViewSummary={handleViewSummary}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300 py-8">
          No matches found. Click "Create New Match" to add your first match.
        </div>
      )}
    </div>
  );
}

export default ManageMatches;

// Match Card Component
function MatchCard({ 
  match, 
  onEdit, 
  onDelete, 
  onEndMatch, 
  onViewLive, 
  onViewSummary,
  getStatusColor 
}) {
  const navigate = useNavigate();

  // Helper function to get toss winner name
  const getTossWinnerName = () => {
    if (!match.tossWinner) return null;
    
    // If tossWinner is an object with name property (populated)
    if (typeof match.tossWinner === 'object' && match.tossWinner.name) {
      return match.tossWinner.name;
    }
    
    // If tossWinner is just an ID string, try to match with teamA or teamB
    const tossWinnerId = match.tossWinner.toString ? match.tossWinner.toString() : match.tossWinner;
    const teamAId = match.teamA?._id?.toString();
    const teamBId = match.teamB?._id?.toString();
    
    if (tossWinnerId === teamAId) {
      return match.teamA?.name || "Team A";
    }
    if (tossWinnerId === teamBId) {
      return match.teamB?.name || "Team B";
    }
    
    // Fallback: check if team objects have _id property
    if (match.teamA && match.teamA._id && tossWinnerId === match.teamA._id.toString()) {
      return match.teamA.name;
    }
    
    if (match.teamB && match.teamB._id && tossWinnerId === match.teamB._id.toString()) {
      return match.teamB.name;
    }
    
    return "Unknown Team";
  };

  const tossWinnerName = getTossWinnerName();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Team A logo */}
          <img
            src={match.teamA?.logo || "/default-team.png"}
            alt={match.teamA?.name || "Team A"}
            className="h-10 w-10 rounded object-cover"
          />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {match.matchName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Match #{match.matchNumber}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {match.matchType} • {match.overs} overs
            </p>
          </div>

          {/* Team B logo */}
          <img
            src={match.teamB?.logo || "/default-team.png"}
            alt={match.teamB?.name || "Team B"}
            className="h-10 w-10 rounded object-cover ml-3"
          />
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            match.status
          )}`}
        >
          {match.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">{match.teamA?.name}</span> vs{" "}
          <span className="font-medium">{match.teamB?.name}</span>
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {match.venue?.name}, {match.venue?.city}
        </p>

        {match.venue?.groundType && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ground Type: {match.venue.groundType}
          </p>
        )}

        {match.scorerId && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Scorer: {match.scorerId.name}
          </p>
        )}

        {/* Show toss info if available */}
        {match.tossWinner && tossWinnerName && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Toss Information
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Winner:</span> {tossWinnerName}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Decision:</span>{" "}
              <span className="capitalize font-medium">{match.electedTo}</span>
            </div>
          </div>
        )}
      </div>

      {/* Umpires list */}
      {Array.isArray(match.umpires) && match.umpires.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium dark:text-gray-200">
            Umpires:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-5">
            {match.umpires.map((u, idx) => (
              <li key={idx}>
                {u.name} {u.role ? `(${u.role})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Score for live matches */}
      {match.status === "live" && match.currentScore && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Current Score
              </p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                {match.currentScore.runs}/{match.currentScore.wickets}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Overs: {match.currentScore.overs}
              </p>
            </div>
            {/* Show target if second innings */}
            {match.currentScore.target && (
              <div className="text-right">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Target: {match.currentScore.target}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Need {match.currentScore.target - match.currentScore.runs} runs
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(`/admin/matches/view/${match._id}`)}
          className="bg-gray-700 text-pink-300 px-3 py-1 rounded text-sm hover:bg-gray-800 flex items-center gap-1"
        >
          <Eye className="w-5 h-5 mr-1" /> View
        </button>

        {/* EDIT BUTTON ONLY FOR UPCOMING */}
        {match.status === "upcoming" && (
          <>
            <button
              onClick={() => onEdit(match)}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
            >
              Edit
            </button>

            {/* DELETE BUTTON ONLY FOR UPCOMING */}
            <button
              onClick={() => onDelete(match._id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}

        {match.status === "live" && (
          <>
            <button
              onClick={() => onViewLive(match._id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              View Live
            </button>

            <button
              onClick={() => onEndMatch(match._id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              End Match
            </button>
          </>
        )}

        {match.status === "completed" && (
          <button
            onClick={() => onViewSummary(match._id)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            View Summary
          </button>
        )}
      </div>
    </div>
  );
}