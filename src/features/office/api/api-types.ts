// Enums
export enum OfficeAddressType {
  MAIL_BOX = 'MAIL_BOX',
  RECEPTION = 'RECEPTION',
  OFFICE_ADDRESS = 'OFFICE_ADDRESS'
}

export enum OfficeContactType {
  CELL_PHONE = 'CELL_PHONE',
  COMMERCIAL_EMAIL = 'COMMERCIAL_EMAIL',
  FINANCIAL_EMAIL = 'FINANCIAL_EMAIL',
  PEOPLE_MANAGEMENT_EMAIL = 'PEOPLE_MANAGEMENT_EMAIL',
  MARKETING_EMAIL = 'MARKETING_EMAIL',
  SAILS_EMAIL = 'SAILS_EMAIL',
  COMMERCIAL_PHONE = 'COMMERCIAL_PHONE',
  FINANCIAL_PHONE = 'FINANCIAL_PHONE',
  PEOPLE_MANAGEMENT_PHONE = 'PEOPLE_MANAGEMENT_PHONE',
  MARKETING_PHONE = 'MARKETING_PHONE',
  SAILS_PHONE = 'SAILS_PHONE'
}

// Office Group Types
export interface OfficeGroupResource {
  name: string;
  displayName: string;
  registrationNumber: string;
}

export interface OfficeGroupUpdateResource {
  id: string;
  officeGroupData: OfficeGroupResource;
}

export interface OfficeGroupResponse {
  id: string;
  officeGroupData: OfficeGroupResource;
}

// Office Unit Types
export interface OfficeAddressResource {
  street: string;
  complement: string;
  number: string;
  asOf: string;
  country: 'BRAZIL';
  state: string; // Consider creating an enum for Brazilian states
  city: string;
  addressType: OfficeAddressType;
  zipCode: string;
}

export interface OfficeContactResource {
  type: OfficeContactType;
  value: string;
}

export interface OfficeUnitResource {
  name: string;
  registrationNumber: string;
  contacts: OfficeContactResource[];
  addresses: OfficeAddressResource[];
}

export interface OfficeUnitUpdateResource {
  id: string;
  officeUnitData: OfficeUnitResource;
}

export interface OfficeUnitResponse {
  id: string;
  officeUnitData: OfficeUnitResource;
}

// Paged Filter Types
export interface PagedFilterOfficeUnitResource {
  pageIndex: number;
  pageSize: number;
  example: OfficeUnitResource;
}

export interface PagedFilterOfficeGroupResource {
  pageIndex: number;
  pageSize: number;
  example: OfficeGroupResource;
}

// Paged Response Types
export interface PagedResponseOfficeUnitResponse {
  numberOfPages: number;
  currentPageIndex: number;
  count: number;
  pageSize: number;
  content: OfficeUnitResponse[];
}

export interface PagedResponseOfficeGroupResponse {
  numberOfPages: number;
  currentPageIndex: number;
  count: number;
  pageSize: number;
}

// Brazilian States Enum
export enum BrazilianState {
  AMAZONAS = 'AMAZONAS',
  ALAGOAS = 'ALAGOAS',
  ACRE = 'ACRE',
  AMAPA = 'AMAPA',
  BAHIA = 'BAHIA',
  PARA = 'PARA',
  MATO_GROSSO = 'MATO_GROSSO',
  MINAS_GERAIS = 'MINAS_GERAIS',
  MATO_GROSSO_DO_SUL = 'MATO_GROSSO_DO_SUL',
  GOIAS = 'GOIAS',
  MARANHAO = 'MARANHAO',
  RIO_GRANDE_DO_SUL = 'RIO_GRANDE_DO_SUL',
  TOCANTINS = 'TOCANTINS',
  PIAUI = 'PIAUI',
  SAO_PAULO = 'SAO_PAULO',
  RONDONIA = 'RONDONIA',
  RORAIMA = 'RORAIMA',
  PARANA = 'PARANA',
  CEARA = 'CEARA',
  PERNAMBUCO = 'PERNAMBUCO',
  SANTA_CATARINA = 'SANTA_CATARINA',
  PARAIBA = 'PARAIBA',
  RIO_GRANDE_DO_NORTE = 'RIO_GRANDE_DO_NORTE',
  ESPIRITO_SANTO = 'ESPIRITO_SANTO',
  RIO_DE_JANEIRO = 'RIO_DE_JANEIRO',
  SERGIPE = 'SERGIPE',
  DISTRITO_FEDERAL = 'DISTRITO_FEDERAL'
}
