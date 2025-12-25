// hooks/useScoring.js
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { switchStrike } from '../store/matchSlice';

export default function useScoring() {
  const dispatch = useDispatch();

  const calculateRequiredRate = useCallback((runsNeeded, ballsRemaining) => {
    if (ballsRemaining <= 0) return null;
    const oversRemaining = ballsRemaining / 6;
    return (runsNeeded / oversRemaining).toFixed(2);
  }, []);

  const handleStrikeRotation = useCallback((ballOutcome) => {
    // Rotate strike on odd runs or wide/no-ball that's not a boundary
    const runs = ballOutcome.runs || 0;
    const extras = ballOutcome.extras || 0;
    const isBoundary = [4, 6].includes(runs);
    
    if ((runs % 2 !== 0 && !isBoundary) || (extras === 1 && runs % 2 !== 0)) {
      dispatch(switchStrike());
    }
  }, [dispatch]);

  const getOverProgress = useCallback((balls) => {
    return balls.map(ball => ({
      ...ball,
      display: ball.isWicket ? 'W' : 
               ball.extras > 0 ? `${ball.extras}${ball.extraType?.charAt(0) || 'E'}` :
               ball.runs.toString()
    }));
  }, []);

  return {
    calculateRequiredRate,
    handleStrikeRotation,
    getOverProgress,
  };
}