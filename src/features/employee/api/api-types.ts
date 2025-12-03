import { PersonalDataResource } from "../../client/api/api-types"

export interface Employee {
    personalData: PersonalDataResource;
    employeeType: string;
    officeUnitIds: string[];
    roles: string[];
}