// store/matchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Async thunks
export const fetchMatchDetails = createAsyncThunk(
  "match/fetchDetails",
  async (matchId, { rejectWithValue }) => {
    try {
      const data = await api.get(`/matches/${matchId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch match");
    }
  }
);

export const startMatchScoring = createAsyncThunk(
  "match/startScoring",
  async ({ matchId, players }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/matches/${matchId}/start-scoring`, players);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to start scoring");
    }
  }
);

export const submitBall = createAsyncThunk(
  "match/submitBall",
  async ({ matchId, ballData }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/matches/${matchId}/ball`, ballData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to submit ball");
    }
  }
);

export const changeBowler = createAsyncThunk(
  "match/changeBowler",
  async ({ matchId, bowlerId }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/matches/${matchId}/change-bowler`, { bowlerId });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to change bowler");
    }
  }
);

export const changeBatter = createAsyncThunk(
  "match/changeBatter",
  async ({ matchId, batterId, position }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/matches/${matchId}/change-batter`, {
        batterId,
        position,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to change batter");
    }
  }
);

export const endInnings = createAsyncThunk(
  "match/endInnings",
  async ({ matchId, reason }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/matches/${matchId}/end-innings`, { reason });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to end innings");
    }
  }
);

export const endMatch = createAsyncThunk(
  "match/endMatch",
  async ({ matchId, result, reason }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/matches/${matchId}/end`, { result, reason });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to end match");
    }
  }
);

const matchSlice = createSlice({
  name: "match",
  initialState: {
    currentMatch: null,
    loading: false,
    error: null,
    liveScore: null,
    commentary: [],
    events: [],
    needsNewBatter: null,
    isSocketConnected: false,
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    updateLiveScore: (state, action) => {
      state.liveScore = action.payload;
    },
    addCommentary: (state, action) => {
      state.commentary.unshift(action.payload);
      if (state.commentary.length > 10) {
        state.commentary = state.commentary.slice(0, 10);
      }
    },
    addEvent: (state, action) => {
      state.events.unshift(action.payload);
      if (state.events.length > 5) {
        state.events = state.events.slice(0, 5);
      }
    },
    setNewBatterNeeded: (state, action) => {
      state.needsNewBatter = action.payload;
    },
    clearNewBatterNeeded: (state) => {
      state.needsNewBatter = null;
    },
    switchStrike: (state) => {
      if (state.liveScore) {
        const temp = state.liveScore.striker;
        state.liveScore.striker = state.liveScore.nonStriker;
        state.liveScore.nonStriker = temp;
      }
    },
    resetMatchState: (state) => {
      state.currentMatch = null;
      state.liveScore = null;
      state.commentary = [];
      state.events = [];
      state.needsNewBatter = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch match details
    builder.addCase(fetchMatchDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMatchDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentMatch = action.payload;
      state.liveScore = action.payload.currentScore || null;
    });
    builder.addCase(fetchMatchDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Submit ball
    builder.addCase(submitBall.fulfilled, (state, action) => {
      // Score will be updated via socket
      // You can add optimistic update here if needed
    });

    // End innings
    builder.addCase(endInnings.fulfilled, (state) => {
      // Handle innings end
    });

    // End match
    builder.addCase(endMatch.fulfilled, (state) => {
      state.currentMatch = null;
      state.liveScore = null;
    });
  },
});

export const {
  setSocketConnected,
  updateLiveScore,
  addCommentary,
  addEvent,
  setNewBatterNeeded,
  clearNewBatterNeeded,
  switchStrike,
  resetMatchState,
} = matchSlice.actions;

export default matchSlice.reducer;