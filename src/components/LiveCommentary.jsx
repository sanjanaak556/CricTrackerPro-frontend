export default function LiveCommentary({ commentary }) {
    if (!commentary || commentary.length === 0)
      return <p className="text-gray-500">No commentary yet...</p>;
  
    return (
      <div className="space-y-2">
        {commentary.map((c, index) => (
          <div key={index} className="p-3 bg-white border rounded shadow-sm">
            <div className="font-semibold text-blue-700">{c.event}</div>
            <p className="text-gray-600 text-sm">{c.text}</p>
          </div>
        ))}
      </div>
    );
  }
  