export interface UserData{
    employeeId: string,
    officeGroupId: string,
    officeUnitIds: [],
    fullName: string,
    roles: []
  }

  export interface User{
    userData: UserData,
    accessToken: string
  }