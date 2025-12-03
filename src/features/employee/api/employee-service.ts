import apiClient from '../../../config/api';
import { Employee } from "./api-types";
import { loggedInUser } from "../../auth/api/authService";
import axios from 'axios';

export const employeeService = {
  post: async (employee: Employee) => {
<<<<<<< Updated upstream
    const response = await apiClient.post(`/${loggedInUser?.userData.officeGroupId}/employee`, employee);
    return response.data;
=======
    await axios.post(API_URL+"/"+loggedInUser?.userData.officeGroupId+'/employee'
      , employee
      ,{
      headers: {
        'Authorization': loggedInUser?.accessToken
      }
    });
>>>>>>> Stashed changes
  },
}; 


