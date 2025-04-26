import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teams: [],
  currentTeam: null,
  suggestedTeams: [],
  loading: false,
  error: null
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    fetchTeamsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeamsSuccess: (state, action) => {
      state.loading = false;
      state.teams = action.payload;
      state.error = null;
    },
    fetchTeamsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTeamByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeamByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentTeam = action.payload;
      state.error = null;
    },
    fetchTeamByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTeamSuccess: (state, action) => {
      state.loading = false;
      state.teams = [...state.teams, action.payload];
      state.currentTeam = action.payload;
      state.error = null;
    },
    createTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTeamSuccess: (state, action) => {
      state.loading = false;
      state.teams = state.teams.map(team => 
        team.id === action.payload.id ? action.payload : team
      );
      if (state.currentTeam && state.currentTeam.id === action.payload.id) {
        state.currentTeam = action.payload;
      }
      state.error = null;
    },
    updateTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    joinTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    joinTeamSuccess: (state, action) => {
      state.loading = false;
      state.teams = state.teams.map(team => 
        team.id === action.payload.id ? action.payload : team
      );
      state.currentTeam = action.payload;
      state.error = null;
    },
    joinTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    leaveTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    leaveTeamSuccess: (state, action) => {
      state.loading = false;
      state.teams = state.teams.map(team => 
        team.id === action.payload.id ? action.payload : team
      );
      state.currentTeam = null;
      state.error = null;
    },
    leaveTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSuggestedTeamsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuggestedTeamsSuccess: (state, action) => {
      state.loading = false;
      state.suggestedTeams = action.payload;
      state.error = null;
    },
    fetchSuggestedTeamsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearTeamError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  fetchTeamsStart,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  fetchTeamByIdStart,
  fetchTeamByIdSuccess,
  fetchTeamByIdFailure,
  createTeamStart,
  createTeamSuccess,
  createTeamFailure,
  updateTeamStart,
  updateTeamSuccess,
  updateTeamFailure,
  joinTeamStart,
  joinTeamSuccess,
  joinTeamFailure,
  leaveTeamStart,
  leaveTeamSuccess,
  leaveTeamFailure,
  fetchSuggestedTeamsStart,
  fetchSuggestedTeamsSuccess,
  fetchSuggestedTeamsFailure,
  clearTeamError
} = teamSlice.actions;

export default teamSlice.reducer;
