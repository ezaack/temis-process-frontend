import { PersonalDataResource } from "../../client/api/api-types";
import { OfficeGroupResource, OfficeUnitResource } from "../../office/api/api-types";

export interface SignUpData {
  customerData: PersonalDataResource;
  signUpData: {
    login: string | null;
    password: string | null;
  };
  officeGroupData: OfficeGroupResource;
  groupMatrixUnitData: OfficeUnitResource;
} 