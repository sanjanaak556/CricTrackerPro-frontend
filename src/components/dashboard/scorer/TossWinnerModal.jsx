import React, { useState } from 'react';
import api from '../../../services/api'; 

const TossWinnerModal = ({ 
  matchId, 
  teamA, 
  teamB, 
  onClose, 
  onSuccess 
}) => {
  const [tossData, setTossData] = useState({
    tossWinner: "",
    electedTo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async () => {
    // Validate both fields are selected
    if (!tossData.tossWinner) {
      setValidationError("Please select toss winner");
      return;
    }
    if (!tossData.electedTo) {
      setValidationError("Please select elected to (bat or bowl)");
      return;
    }

    setSubmitting(true);
    setValidationError("");
    
    try {
      const updateData = {
        tossWinner: tossData.tossWinner,
        electedTo: tossData.electedTo,
        status: "live", // Update status to live
      };

      // Send update request
      await api.put(`/matches/${matchId}`, updateData);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(updateData);
      }
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error("Error updating toss:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update toss";
      setValidationError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamSelection = (teamId) => {
    setTossData(prev => ({ ...prev, tossWinner: teamId }));
    setValidationError("");
  };

  const handleDecisionSelection = (decision) => {
    setTossData(prev => ({ ...prev, electedTo: decision }));
    setValidationError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">
            Toss Information
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={submitting}
          >
            ✕
          </button>
        </div>
        
        {validationError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
            {validationError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Toss Winner *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTeamSelection(teamA._id)}
                className={`px-3 py-2 rounded border flex items-center justify-center gap-2 ${
                  tossData.tossWinner === teamA._id 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
                disabled={submitting}
              >
                {teamA.logo && (
                  <img 
                    src={teamA.logo} 
                    alt={teamA.name} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{teamA.name}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTeamSelection(teamB._id)}
                className={`px-3 py-2 rounded border flex items-center justify-center gap-2 ${
                  tossData.tossWinner === teamB._id 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
                disabled={submitting}
              >
                {teamB.logo && (
                  <img 
                    src={teamB.logo} 
                    alt={teamB.name} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{teamB.name}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Elected To *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDecisionSelection("bat")}
                className={`px-3 py-2 rounded border ${
                  tossData.electedTo === "bat" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
                disabled={submitting}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Bat</span>
                  <span className="text-xs mt-1">Batting First</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDecisionSelection("bowl")}
                className={`px-3 py-2 rounded border ${
                  tossData.electedTo === "bowl" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
                disabled={submitting}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Bowl</span>
                  <span className="text-xs mt-1">Bowling First</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 px-4 py-2 rounded font-medium ${
                submitting 
                  ? "bg-green-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {submitting ? "Submitting..." : "Start Match"}
            </button>
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <p>⚠️ After submitting, match status will change to "LIVE" and you can start scoring.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TossWinnerModal;