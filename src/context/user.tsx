export interface UserData{
    employeeId: string,
    officeGroupId: string,
    officeUnitIds: [],
    fullName: string,
    roles: [],
    officeUnits:UserOfficeUnitData[]
  }
  export interface UserOfficeUnitData{
    officeUnitId: string,
    officeUnitName: string
  }

  export interface User{
    userData: UserData,
    accessToken: string
  }