import axios from 'axios';
import type { 
  ClientCreateRequest, 
  ClientUpdateRequest, 
  ClientResponse
} from './api-types';
import { loggedInUser } from '../../auth/api/authService';

const API_URL = 'http://localhost:8080/v0';

export const clientService = {
  create: async (data: ClientCreateRequest): Promise<ClientResponse> => {
    const response = await axios.post(`${API_URL}/office-group/${loggedInUser?.userData.officeGroupId}/clients`, data,
    {
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },

  update: async (data: ClientUpdateRequest): Promise<ClientResponse> => {
    const response = await axios.put(`${API_URL}/office-group/${loggedInUser?.userData.officeGroupId}/clients`, data,
    {
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await axios.delete(`${API_URL}/office-group/${loggedInUser?.userData.officeGroupId}/clients`, {
      params: { id },
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },

  fetchById: async (id: string): Promise<ClientResponse> => {
    const response = await axios.get(`${API_URL}/office-group/${loggedInUser?.userData.officeGroupId}/clients/${id}`,
    {
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },
  
  search: async (filter:any): Promise<ClientResponse> => {
    const response = await axios.post(`${API_URL}/office-group/${loggedInUser?.userData.officeGroupId}/clients/search`,
    filter,
    {
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  }
}; 