import apiClient from '../../../config/api';
import type {
  CasoResource,
  CreateCasoResponse,
  CasoFilterRequest,
  PagedResponseCasoDetailResource,
  CasoDetailResource,
  UpdateCasoRequest
} from './api-types';

export const casoService = {
  criarCaso: async (groupId: string, data: CasoResource): Promise<CreateCasoResponse> => {
    const response = await apiClient.post(`/office-group/${groupId}/caso`, data);
    return response.data;
  },

  searchCasos: async (groupId: string, filter: CasoFilterRequest): Promise<PagedResponseCasoDetailResource> => {
    const response = await apiClient.post(`/office-group/${groupId}/caso/search`, filter);
    return response.data;
  },

  getCaso: async (groupId: string, casoId: string): Promise<CasoDetailResource> => {
    const response = await apiClient.get(`/office-group/${groupId}/caso/${casoId}`);
    return response.data;
  },

  updateCaso: async (groupId: string, casoId: string, data: UpdateCasoRequest): Promise<CasoDetailResource> => {
    const response = await apiClient.put(`/office-group/${groupId}/caso/${casoId}`, data);
    return response.data;
  },

  deleteCaso: async (groupId: string, casoId: string): Promise<void> => {
    await apiClient.delete(`/office-group/${groupId}/caso/${casoId}`);
  }
};
