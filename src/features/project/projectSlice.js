import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    fetchProjectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectsSuccess: (state, action) => {
      state.loading = false;
      state.projects = action.payload;
      state.error = null;
    },
    fetchProjectsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProjectByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentProject = action.payload;
      state.error = null;
    },
    fetchProjectByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createProjectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProjectSuccess: (state, action) => {
      state.loading = false;
      state.projects = [...state.projects, action.payload];
      state.currentProject = action.payload;
      state.error = null;
    },
    createProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProjectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProjectSuccess: (state, action) => {
      state.loading = false;
      state.projects = state.projects.map(project => 
        project.id === action.payload.id ? action.payload : project
      );
      if (state.currentProject && state.currentProject.id === action.payload.id) {
        state.currentProject = action.payload;
      }
      state.error = null;
    },
    updateProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    submitProjectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitProjectSuccess: (state, action) => {
      state.loading = false;
      state.projects = state.projects.map(project => 
        project.id === action.payload.id ? action.payload : project
      );
      if (state.currentProject && state.currentProject.id === action.payload.id) {
        state.currentProject = action.payload;
      }
      state.error = null;
    },
    submitProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAIFeedbackStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAIFeedbackSuccess: (state, action) => {
      state.loading = false;
      // Assuming the payload includes the project with feedback added
      state.projects = state.projects.map(project => 
        project.id === action.payload.id ? action.payload : project
      );
      if (state.currentProject && state.currentProject.id === action.payload.id) {
        state.currentProject = action.payload;
      }
      state.error = null;
    },
    getAIFeedbackFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProjectError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  fetchProjectByIdStart,
  fetchProjectByIdSuccess,
  fetchProjectByIdFailure,
  createProjectStart,
  createProjectSuccess,
  createProjectFailure,
  updateProjectStart,
  updateProjectSuccess,
  updateProjectFailure,
  submitProjectStart,
  submitProjectSuccess,
  submitProjectFailure,
  getAIFeedbackStart,
  getAIFeedbackSuccess,
  getAIFeedbackFailure,
  clearProjectError
} = projectSlice.actions;

export default projectSlice.reducer;
