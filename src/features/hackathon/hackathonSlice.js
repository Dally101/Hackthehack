import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hackathons: [],
  currentHackathon: null,
  userHackathons: [],
  loading: false,
  error: null
};

export const hackathonSlice = createSlice({
  name: 'hackathon',
  initialState,
  reducers: {
    fetchHackathonsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHackathonsSuccess: (state, action) => {
      state.loading = false;
      state.hackathons = action.payload;
      state.error = null;
    },
    fetchHackathonsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchHackathonByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHackathonByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentHackathon = action.payload;
      state.error = null;
    },
    fetchHackathonByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserHackathonsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserHackathonsSuccess: (state, action) => {
      state.loading = false;
      state.userHackathons = action.payload;
      state.error = null;
    },
    fetchUserHackathonsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerForHackathonStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerForHackathonSuccess: (state, action) => {
      state.loading = false;
      state.userHackathons = [...state.userHackathons, action.payload];
      state.error = null;
    },
    registerForHackathonFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createHackathonStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createHackathonSuccess: (state, action) => {
      state.loading = false;
      state.hackathons = [...state.hackathons, action.payload];
      state.userHackathons = [...state.userHackathons, action.payload];
      state.error = null;
    },
    createHackathonFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateHackathonStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateHackathonSuccess: (state, action) => {
      state.loading = false;
      state.hackathons = state.hackathons.map(hackathon => 
        hackathon.id === action.payload.id ? action.payload : hackathon
      );
      state.userHackathons = state.userHackathons.map(hackathon => 
        hackathon.id === action.payload.id ? action.payload : hackathon
      );
      if (state.currentHackathon && state.currentHackathon.id === action.payload.id) {
        state.currentHackathon = action.payload;
      }
      state.error = null;
    },
    updateHackathonFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearHackathonError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  fetchHackathonsStart,
  fetchHackathonsSuccess,
  fetchHackathonsFailure,
  fetchHackathonByIdStart,
  fetchHackathonByIdSuccess,
  fetchHackathonByIdFailure,
  fetchUserHackathonsStart,
  fetchUserHackathonsSuccess,
  fetchUserHackathonsFailure,
  registerForHackathonStart,
  registerForHackathonSuccess,
  registerForHackathonFailure,
  createHackathonStart,
  createHackathonSuccess,
  createHackathonFailure,
  updateHackathonStart,
  updateHackathonSuccess,
  updateHackathonFailure,
  clearHackathonError
} = hackathonSlice.actions;

export default hackathonSlice.reducer;
