import React, { useState } from "react";

export default function BallControls({ onSubmitBall, onWicketSelect, disabled = false }) {
  const [showExtras, setShowExtras] = useState(false);
  const [showWicketTypes, setShowWicketTypes] = useState(false);

  /* ======================================================
     GUARD
  ====================================================== */
  const safeSubmit = (payload) => {
    if (disabled) return;
    onSubmitBall(payload);
    setShowExtras(false);
    setShowWicketTypes(false);
  };

  /* ======================================================
     RUNS
  ====================================================== */
  const submitRuns = (runs) => {
    safeSubmit({
      type: "RUN",
      runs,
    });
  };

  /* ======================================================
     EXTRAS
  ====================================================== */
  const submitExtra = (extraType) => {
    safeSubmit({
      type: "EXTRA",
      extraType, // wide | noball | bye | legbye
    });
  };

  /* ======================================================
     WICKET
  ====================================================== */
  const submitWicket = (wicketType) => {
    safeSubmit({
      type: "WICKET",
      wicketType, // bowled | caught | lbw | runout | stumped | hitwicket
    });
  };

  /* ======================================================
     STYLES
  ====================================================== */
  const baseBtn =
    "py-2 rounded font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className={`space-y-3 ${disabled ? "opacity-60" : ""}`}>
      {/* INFO */}
      {disabled && (
        <div className="text-sm text-yellow-400 text-center">
          Start the over to enable scoring
        </div>
      )}

      {/* RUN BUTTONS */}
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3, 4, 6].map((run) => (
          <button
            key={run}
            disabled={disabled}
            onClick={() => submitRuns(run)}
            className={`${baseBtn} bg-green-600 hover:bg-green-700 text-white`}
          >
            {run}
          </button>
        ))}
      </div>

      {/* EXTRA & WICKET TOGGLES */}
      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={disabled}
          onClick={() => {
            setShowExtras(!showExtras);
            setShowWicketTypes(false);
          }}
          className={`${baseBtn} bg-blue-600 hover:bg-blue-700 text-white`}
        >
          Extras
        </button>

        <button
          disabled={disabled}
          onClick={() => {
            setShowWicketTypes(!showWicketTypes);
            setShowExtras(false);
          }}
          className={`${baseBtn} bg-red-600 hover:bg-red-700 text-white`}
        >
          Wicket
        </button>
      </div>

      {/* EXTRAS PANEL */}
      {showExtras && !disabled && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "wide", label: "Wide" },
            { key: "noball", label: "No Ball" },
            { key: "bye", label: "Bye" },
            { key: "legbye", label: "Leg Bye" },
          ].map((e) => (
            <button
              key={e.key}
              onClick={() => submitExtra(e.key)}
              className={`${baseBtn} bg-blue-500 hover:bg-blue-600 text-white`}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}

      {/* WICKET TYPES PANEL */}
      {showWicketTypes && !disabled && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "bowled",
            "caught",
            "lbw",
            "runout",
            "stumped",
            "hitwicket",
          ].map((type) => (
            <button
              key={type}
              onClick={() => onWicketSelect(type)}
              className={`${baseBtn} bg-red-500 hover:bg-red-600 text-white capitalize`}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
