import axios from 'axios';
import type { 
  OfficeGroupResource, 
  OfficeGroupResponse,
  OfficeUnitResource,
  OfficeUnitResponse,
  PagedFilterOfficeUnitResource,
  PagedResponseOfficeUnitResponse
} from './api-types';
import { loggedInUser } from '../../auth/api/authService';

const API_URL = 'http://termis-process-service-6klewh6jvq-lz.a.run.app/v0';

export const officeService = {
  createGroup: async (data: OfficeGroupResource): Promise<OfficeGroupResponse> => {
    const response = await axios.post(`${API_URL}/office-group`, data,{
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },

  createUnit: async (groupId: string, data: OfficeUnitResource): Promise<OfficeUnitResponse> => {
    const response = await axios.post(`${API_URL}/office-group/${groupId}/office-unit`, data,{
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },

  fetchGroupById: async (id: string): Promise<OfficeGroupResponse> => {
    const response = await axios.get(`${API_URL}/office-group/${id}`,{
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },
  fetchMyGroup: async (): Promise<OfficeGroupResponse> => {
    const response = await axios.get(`${API_URL}/office-group`,{
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  },
  searchUnits: async (groupId: string, filter: PagedFilterOfficeUnitResource): Promise<PagedResponseOfficeUnitResponse & { content: OfficeUnitResponse[] }> => {
    const response = await axios.post(`${API_URL}/office-group/${groupId}/office-unit/search`, filter,{
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
    return response.data;
  }
}; 