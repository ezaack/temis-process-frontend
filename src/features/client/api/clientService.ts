import axios from 'axios';
import type { 
  ClientCreateRequest, 
  ClientUpdateRequest, 
  ClientResponse 
} from './api-types';

const API_URL = 'http://localhost:8080/v0';

export const clientService = {
  create: async (data: ClientCreateRequest): Promise<ClientResponse> => {
    const response = await axios.post(`${API_URL}/clients`, data);
    return response.data;
  },

  update: async (data: ClientUpdateRequest): Promise<ClientResponse> => {
    const response = await axios.put(`${API_URL}/clients`, data);
    return response.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await axios.delete(`${API_URL}/clients`, {
      params: { id }
    });
    return response.data;
  },

  fetchById: async (id: string): Promise<ClientResponse> => {
    const response = await axios.get(`${API_URL}/clients/${id}`);
    return response.data;
  }
}; 