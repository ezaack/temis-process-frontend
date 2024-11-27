import axios from 'axios';

const API_URL = 'http://localhost:8080/v0/auth/signin'; // Adjust the URL as needed

export const authService = {
  login: async (credentials: { login: string; password: string }) => {
    const response = await axios.post(API_URL, credentials);
    console.log('Login response:', response.data); // Debugging line
    return response.data; // Ensure this contains user data
  },
}; 