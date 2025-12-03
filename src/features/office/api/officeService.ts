import apiClient from '../../../config/api';
import type {
  OfficeGroupResource,
  OfficeGroupResponse,
  OfficeUnitResource,
  OfficeUnitResponse,
  PagedFilterOfficeUnitResource,
  PagedResponseOfficeUnitResponse
} from './api-types';

export const officeService = {
  createGroup: async (data: OfficeGroupResource): Promise<OfficeGroupResponse> => {
    const response = await apiClient.post('/office-group', data);
    return response.data;
  },

  createUnit: async (groupId: string, data: OfficeUnitResource): Promise<OfficeUnitResponse> => {
    const response = await apiClient.post(`/office-group/${groupId}/office-unit`, data);
    return response.data;
  },

  fetchGroupById: async (id: string): Promise<OfficeGroupResponse> => {
    const response = await apiClient.get(`/office-group/${id}`);
    return response.data;
  },

  fetchMyGroup: async (): Promise<OfficeGroupResponse> => {
    const response = await apiClient.get('/office-group');
    return response.data;
  },

  searchUnits: async (groupId: string, filter: PagedFilterOfficeUnitResource): Promise<PagedResponseOfficeUnitResponse & { content: OfficeUnitResponse[] }> => {
    const response = await apiClient.post(`/office-group/${groupId}/office-unit/search`, filter);
    return response.data;
  }
}; 