import apiClient from '../../../config/api';
import type {
  ClientCreateRequest,
  ClientUpdateRequest,
  ClientResponse
} from './api-types';
import { loggedInUser } from '../../auth/api/authService';

export const clientService = {
  create: async (data: ClientCreateRequest): Promise<ClientResponse> => {
    const response = await apiClient.post(`/office-group/${loggedInUser?.userData.officeGroupId}/clients`, data);
    return response.data;
  },

  update: async (data: ClientUpdateRequest): Promise<ClientResponse> => {
    const response = await apiClient.put(`/office-group/${loggedInUser?.userData.officeGroupId}/clients`, data);
    return response.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete(`/office-group/${loggedInUser?.userData.officeGroupId}/clients`, {
      params: { id }
    });
    return response.data;
  },

  fetchById: async (id: string): Promise<ClientResponse> => {
    const response = await apiClient.get(`/office-group/${loggedInUser?.userData.officeGroupId}/clients/${id}`);
    return response.data;
  },

  search: async (filter:any): Promise<ClientResponse> => {
    const response = await apiClient.post(`/office-group/${loggedInUser?.userData.officeGroupId}/clients/search`, filter);
    return response.data;
  }
}; 