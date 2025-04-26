import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import hackathonReducer from './features/hackathon/hackathonSlice';
import teamReducer from './features/team/teamSlice';
import projectReducer from './features/project/projectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hackathon: hackathonReducer,
    team: teamReducer,
    project: projectReducer
  }
});

export default store;
