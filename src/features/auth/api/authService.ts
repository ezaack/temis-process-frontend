import axios from 'axios';
import { User, UserData } from '../../../context/user';

const API_URL = 'http://localhost:8080/v0/auth'; // Adjust the URL as needed

export var loggedInUser: User | null = null;

export const authService = {
  login: async (credentials: { login: string; password: string }) => {
    const response = await axios.post(API_URL+'/signin', credentials);
    console.log('Login response:', response.data); // Debugging line
    loggedInUser = response.data;
    console.log('loggedInUser:', loggedInUser); // Debugging line
    return loggedInUser; // Ensure this contains user data
  },
  signUp: async (data: any) => {
    const response = await axios.post(API_URL+'/signup', data);
    return response.data; // Return the response data
  },
}; 


