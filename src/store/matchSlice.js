import { createSlice } from "@reduxjs/toolkit";

const matchSlice = createSlice({
  name: "match",
  initialState: {
    activeMatch: null,
    liveScore: null,
  },
  reducers: {
    setActiveMatch: (state, action) => {
      state.activeMatch = action.payload;
    },
    setLiveScore: (state, action) => {
      state.liveScore = action.payload;
    },
  }
});

export const { setActiveMatch, setLiveScore } = matchSlice.actions;
export default matchSlice.reducer;
