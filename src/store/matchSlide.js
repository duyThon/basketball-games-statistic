import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: null,
  season: "",
  matchType: "5v5",
  homeTeam: null,
  awayTeam: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatchInfo: (state, action) => {
      const { season, matchType, homeTeam, awayTeam } = action.payload;
      state.season = season;
      state.matchType = matchType;
      state.homeTeam = homeTeam;
      state.awayTeam = awayTeam;
    },
    setMatchId: (state, action) => {
      state.matchId = action.payload;
    },
    clearMatchInfo: () => initialState,
  },
});

export const { setMatchInfo, setMatchId, clearMatchInfo } = matchSlice.actions;

export default matchSlice.reducer;
