export default function LiveTimeline({ balls }) {
    if (!balls || balls.length === 0)
      return <p className="text-gray-500">Waiting for updates...</p>;
  
    return (
      <div className="space-y-3">
        {balls.map((ball, index) => (
          <div
            key={index}
            className="p-3 bg-white shadow-sm border rounded flex justify-between"
          >
            <div>
              <div className="font-semibold">
                Ball {ball.ballNumber} — Over {ball.overNumber}
              </div>
              <div className="text-gray-600 text-sm">{ball.commentary}</div>
            </div>
  
            {/* Badge */}
            <span
              className={`px-3 py-1 rounded text-white font-bold ${
                ball.isWicket
                  ? "bg-red-600"
                  : ball.runs === 4
                  ? "bg-blue-600"
                  : ball.runs === 6
                  ? "bg-green-600"
                  : ball.runs === 0
                  ? "bg-gray-500"
                  : "bg-yellow-600"
              }`}
            >
              {ball.isWicket ? "W" : ball.runs}
            </span>
          </div>
        ))}
      </div>
    );
  }
  