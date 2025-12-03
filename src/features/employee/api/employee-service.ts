import apiClient from '../../../config/api';
import { Employee } from "./api-types";
import { loggedInUser } from "../../auth/api/authService";

export const employeeService = {
  post: async (employee: Employee) => {
    const response = await apiClient.post(`/${loggedInUser?.userData.officeGroupId}/employee`, employee);
    return response.data;
  },
}; 


