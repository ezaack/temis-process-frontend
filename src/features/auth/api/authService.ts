import apiClient, { setAuthTokenGetter } from '../../../config/api';
import { User, UserData } from '../../../context/user';

export var loggedInUser: User | null = null;

// Register the token getter function so the API client can access the token
setAuthTokenGetter(() => loggedInUser?.accessToken || null);

export const authService = {
  login: async (credentials: { login: string; password: string }) => {
    const response = await apiClient.post('/auth/signin', credentials);
    console.log('Login response:', response.data); // Debugging line
    loggedInUser = response.data;

    // Save to sessionStorage for current session only
    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    console.log('loggedInUser:', loggedInUser); // Debugging line
    return loggedInUser; // Ensure this contains user data
  },
  signUp: async (data: any) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data; // Return the response data
  },
}; 


