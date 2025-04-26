import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  logout
} from './authSlice';

import { authService } from '../../services/apiService';

// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const userData = await authService.login(credentials);
    dispatch(loginSuccess(userData.user));
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    dispatch(loginFailure(error.message || 'Login failed'));
    return { success: false, error: error.message || 'Login failed' };
  }
};

// Register action
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const result = await authService.register(userData);
    dispatch(registerSuccess(result.user));
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    dispatch(registerFailure(error.message || 'Registration failed'));
    return { success: false, error: error.message || 'Registration failed' };
  }
};

// Update profile action
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileStart());
    const updatedUser = await authService.updateProfile(userData);
    dispatch(updateProfileSuccess(updatedUser));
    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    dispatch(updateProfileFailure(error.message || 'Profile update failed'));
    return { success: false, error: error.message || 'Profile update failed' };
  }
};

// Get current user
export const getCurrentUser = () => async (dispatch) => {
  try {
    dispatch(loginStart());
    const userData = await authService.getCurrentUser();
    dispatch(loginSuccess(userData));
    return { success: true };
  } catch (error) {
    console.error('Get current user error:', error);
    dispatch(loginFailure(null)); // Silent failure, just clear the auth state
    return { success: false };
  }
};

// Logout action
export const logoutUser = () => (dispatch) => {
  authService.logout();
  dispatch(logout());
  return { success: true };
}; 