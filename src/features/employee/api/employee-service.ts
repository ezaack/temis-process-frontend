import apiClient from '../../../config/api';
import { Employee } from "./api-types";
import { loggedInUser } from "../../auth/api/authService";
import axios from 'axios';

export const employeeService = {
  post: async (employee: Employee) => {
    const response = await apiClient.post(`/office-group/${loggedInUser?.userData.officeGroupId}/employee`, employee);
    return response.data;
  },
}; 


