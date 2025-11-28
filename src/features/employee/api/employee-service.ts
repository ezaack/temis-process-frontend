import { Employee } from "./api-types";
import { loggedInUser } from "../../auth/api/authService";

const API_URL = 'https://termis-process-service-6klewh6jvq-lz.a.run.app/v0'; // Adjust the URL as neededóø
export const employeeService = {
  post: async (employee: Employee) => {
    await axios.post(API_URL+"/"+loggedInUser?.userData.officeGroupId+'/employee', employee);
  },
}; 


