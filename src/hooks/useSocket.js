// hooks/useSocket.js
import { useEffect, useRef, useState } from "react";
import { socket } from "../services/api";

export default function useSocket(matchId) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [latestScore, setLatestScore] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [events, setEvents] = useState([]);
  const [needsNewBatter, setNeedsNewBatter] = useState(null);

  useEffect(() => {
    // Connection events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      
      // Join match room if matchId provided
      if (matchId) {
        socket.emit("joinMatch", matchId);
        console.log(`Joined match room: match_${matchId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Score updates
    socket.on("liveScoreUpdate", (data) => {
      console.log("Live score update:", data);
      setLatestScore(data);
    });

    socket.on("scoreUpdated", (data) => {
      console.log("Score updated:", data);
      setLatestScore(data);
    });

    // Commentary
    socket.on("newCommentary", (data) => {
      console.log("New commentary:", data);
      setCommentary(prev => [data, ...prev.slice(0, 9)]); // Keep last 10
    });

    // Events
    socket.on("eventReceived", (event) => {
      console.log("Event received:", event);
      setEvents(prev => [event, ...prev.slice(0, 4)]); // Keep last 5
    });

    // Special events
    socket.on("bowlerNotAllowed", (data) => {
      alert(`Bowler not allowed: ${data.message}`);
    });

    socket.on("newBatterNeeded", (data) => {
      console.log("New batter needed:", data);
      setNeedsNewBatter(data);
    });

    socket.on("overComplete", (data) => {
      console.log("Over complete:", data);
      // You can show notification or update UI
    });

    socket.on("inningsComplete", (data) => {
      console.log("Innings complete:", data);
      alert(`Innings completed! Total: ${data.runs}/${data.wickets}`);
    });

    return () => {
      // Cleanup
      if (matchId) {
        socket.emit("leaveMatch", matchId);
      }
      
      socket.off("connect");
      socket.off("disconnect");
      socket.off("liveScoreUpdate");
      socket.off("scoreUpdated");
      socket.off("newCommentary");
      socket.off("eventReceived");
      socket.off("bowlerNotAllowed");
      socket.off("newBatterNeeded");
      socket.off("overComplete");
      socket.off("inningsComplete");
    };
  }, [matchId]);

  const emitScoreUpdate = (data) => {
    socket.emit("scoreUpdate", { matchId, data });
  };

  const emitCommentary = (message) => {
    socket.emit("commentaryUpdate", { matchId, message });
  };

  const emitEvent = (event) => {
    socket.emit("eventUpdate", { matchId, event });
  };

  return {
    isConnected,
    latestScore,
    commentary,
    events,
    needsNewBatter,
    emitScoreUpdate,
    emitCommentary,
    emitEvent,
  };
}