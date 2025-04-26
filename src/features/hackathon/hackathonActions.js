import { 
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
  updateHackathonFailure
} from './hackathonSlice';

import { hackathonService } from '../../services/apiService';

// Async action to fetch all hackathons
export const fetchHackathons = () => async (dispatch) => {
  try {
    dispatch(fetchHackathonsStart());
    const hackathons = await hackathonService.getAll();
    dispatch(fetchHackathonsSuccess(hackathons));
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    dispatch(fetchHackathonsFailure(error.message || 'Failed to fetch hackathons'));
  }
};

// Async action to fetch a single hackathon by ID
export const fetchHackathonById = (id) => async (dispatch) => {
  try {
    dispatch(fetchHackathonByIdStart());
    const hackathon = await hackathonService.getById(id);
    dispatch(fetchHackathonByIdSuccess(hackathon));
  } catch (error) {
    console.error(`Error fetching hackathon with ID ${id}:`, error);
    dispatch(fetchHackathonByIdFailure(error.message || 'Failed to fetch hackathon details'));
  }
};

// Async action to fetch user's hackathons
export const fetchUserHackathons = () => async (dispatch) => {
  try {
    dispatch(fetchUserHackathonsStart());
    const userHackathons = await hackathonService.getUserHackathons();
    dispatch(fetchUserHackathonsSuccess(userHackathons));
  } catch (error) {
    console.error('Error fetching user hackathons:', error);
    dispatch(fetchUserHackathonsFailure(error.message || 'Failed to fetch your hackathons'));
  }
};

// Async action to register user for a hackathon
export const registerForHackathon = (hackathonId) => async (dispatch) => {
  try {
    dispatch(registerForHackathonStart());
    const registration = await hackathonService.registerUser(hackathonId);
    dispatch(registerForHackathonSuccess(registration));
    return { success: true };
  } catch (error) {
    console.error(`Error registering for hackathon with ID ${hackathonId}:`, error);
    dispatch(registerForHackathonFailure(error.message || 'Failed to register for hackathon'));
    return { success: false, error: error.message || 'Registration failed' };
  }
};

// Async action to create a new hackathon
export const createHackathon = (hackathonData) => async (dispatch) => {
  try {
    dispatch(createHackathonStart());
    const newHackathon = await hackathonService.create(hackathonData);
    dispatch(createHackathonSuccess(newHackathon));
    return { success: true, hackathon: newHackathon };
  } catch (error) {
    console.error('Error creating hackathon:', error);
    dispatch(createHackathonFailure(error.message || 'Failed to create hackathon'));
    return { success: false, error: error.message || 'Creation failed' };
  }
};

// Async action to update an existing hackathon
export const updateHackathon = (id, hackathonData) => async (dispatch) => {
  try {
    dispatch(updateHackathonStart());
    const updatedHackathon = await hackathonService.update(id, hackathonData);
    dispatch(updateHackathonSuccess(updatedHackathon));
    return { success: true, hackathon: updatedHackathon };
  } catch (error) {
    console.error(`Error updating hackathon with ID ${id}:`, error);
    dispatch(updateHackathonFailure(error.message || 'Failed to update hackathon'));
    return { success: false, error: error.message || 'Update failed' };
  }
}; 