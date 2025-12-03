import apiClient from '../../../config/api';
import { EmployeeRequest } from "./api-types";
import { loggedInUser } from "../../auth/api/authService";

export const employeeService = {
  post: async (request: EmployeeRequest) => {
    const response = await apiClient.post(`/office-group/${loggedInUser?.userData.officeGroupId}/employee`, request);
    return response.data;
  },

  search: async (searchParams: any) => {
    const response = await apiClient.post(
      `/office-group/${loggedInUser?.userData.officeGroupId}/employee/search`,
      searchParams
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(
      `/office-group/${loggedInUser?.userData.officeGroupId}/employee?id=${id}`
    );
    return response.data;
  },
}; 


