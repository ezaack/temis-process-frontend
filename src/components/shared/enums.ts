export enum RepresentativeType {
  PROXY= 'PROXY',
  ATTOURNEY_IN_FACT= 'ATTOURNEY_IN_FACT',
  LEGAL_GUARDIAN= 'LEGAL_GUARDIAN',
  CURATOR= 'CURATOR',
  LEGAL_REPRESENTATIVE= 'LEGAL_REPRESENTATIVE',
  ADMINISTRATOR= 'ADMINISTRATOR',
  MANAGER= 'MANAGER',
  DIRECTOR= 'DIRECTOR',
  CEO= 'CEO',
  CFO = 'CFO',
  PRESIDENT = 'PRESIDENT',
  BOARD_MEMBER = 'BOARD_MEMBER'
}

export enum Country {
  BRAZIL = 'BRAZIL'
  // Add other countries as needed
}

export enum State {
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

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  CORRESPONDENCE = 'CORRESPONDENCE'
}

export enum ContactType {
  PERSONAL_CELL_PHONE = 'PERSONAL_CELL_PHONE',
  WORK_CELL_PHONE = 'WORK_CELL_PHONE',
  HOME_PHONE = 'HOME_PHONE',
  WORK_PHONE = 'WORK_PHONE',
  PERSONAL_EMAIL = 'PERSONAL_EMAIL',
  WORK_EMAIL = 'WORK_EMAIL'
}

export enum PersonType {
  NATURAL = 'NATURAL',
  LEGAL = 'LEGAL'
}

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  ID = 'ID',
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE'
}

// Helper object para labels em português (opcional)
export const EnumLabels = {
  AddressType: {
    [AddressType.HOME]: 'Residencial',
    [AddressType.WORK]: 'Comercial',
    [AddressType.CORRESPONDENCE]: 'Correspondência'
  },
  ContactType: {
    [ContactType.PERSONAL_CELL_PHONE]: 'Celular Pessoal',
    [ContactType.WORK_CELL_PHONE]: 'Celular Profissional',
    [ContactType.HOME_PHONE]: 'Telefone Residencial',
    [ContactType.WORK_PHONE]: 'Telefone Profissional',
    [ContactType.PERSONAL_EMAIL]: 'Email Pessoal',
    [ContactType.WORK_EMAIL]: 'Email Profissional'
  },
  PersonType: {
    [PersonType.NATURAL]: 'Pessoa Física',
    [PersonType.LEGAL]: 'Pessoa Jurídica'
  },
  DocumentType: {
    [DocumentType.CPF]: 'CPF',
    [DocumentType.CNPJ]: 'CNPJ',
    [DocumentType.ID]: 'RG',
    [DocumentType.PASSPORT]: 'Passaporte',
    [DocumentType.DRIVER_LICENSE]: 'Carteira de Motorista'
  },
  Country: {
    [Country.BRAZIL]: 'Brasil'
  },
  State: {
    [State.AMAZONAS]: 'Amazonas',
    [State.ALAGOAS]: 'Alagoas',
    [State.ACRE]: 'Acre',
    [State.AMAPA]: 'Amapá',
    [State.BAHIA]: 'Bahia',
    [State.PARA]: 'Pará',
    [State.MATO_GROSSO]: 'Mato Grosso',
    [State.MINAS_GERAIS]: 'Minas Gerais',
    [State.MATO_GROSSO_DO_SUL]: 'Mato Grosso do Sul',
    [State.GOIAS]: 'Goiás',
    [State.MARANHAO]: 'Maranhão',
    [State.RIO_GRANDE_DO_SUL]: 'Rio Grande do Sul',
    [State.TOCANTINS]: 'Tocantins',
    [State.PIAUI]: 'Piauí',
    [State.SAO_PAULO]: 'São Paulo',
    [State.RONDONIA]: 'Rondônia',
    [State.RORAIMA]: 'Roraima',
    [State.PARANA]: 'Paraná',
    [State.CEARA]: 'Ceará',
    [State.PERNAMBUCO]: 'Pernambuco',
    [State.SANTA_CATARINA]: 'Santa Catarina',
    [State.PARAIBA]: 'Paraíba',
    [State.RIO_GRANDE_DO_NORTE]: 'Rio Grande do Norte',
    [State.ESPIRITO_SANTO]: 'Espírito Santo',
    [State.RIO_DE_JANEIRO]: 'Rio de Janeiro',
    [State.SERGIPE]: 'Sergipe',
    [State.DISTRITO_FEDERAL]: 'Distrito Federal'
  }
} as const;

// Helper functions para obter arrays de opções (útil para selects)
export const getEnumOptions = <T extends { [key: string]: string }>(
  enumObj: T
): Array<{ value: T[keyof T]; label: string }> => {
  return Object.entries(enumObj).map(([key, value]) => ({
    value: value,
    label: EnumLabels[key as keyof typeof EnumLabels]?.[value] || value
  }));
};

// Exemplo de uso:
// const addressTypeOptions = getEnumOptions(AddressType);
// Resultado:
// [
//   { value: 'HOME', label: 'Residencial' },
//   { value: 'WORK', label: 'Trabalho' },
//   { value: 'OTHER', label: 'Outro' }
// ] 

export const DocumentPatterns = {
  [DocumentType.CPF]: '999.999.999-99',
  [DocumentType.CNPJ]: '99.999.999/9999-99',
  [DocumentType.ID]: '99.999.999-9',
  [DocumentType.PASSPORT]: 'AA999999',
  [DocumentType.DRIVER_LICENSE]: '99999999999'
} as const;

export const ContactPatterns = {
  [ContactType.PERSONAL_CELL_PHONE]: '(99) 99999-9999',
  [ContactType.WORK_CELL_PHONE]: '(99) 99999-9999',
  [ContactType.HOME_PHONE]: '(99) 9999-9999',
  [ContactType.WORK_PHONE]: '(99) 9999-9999',
  [ContactType.PERSONAL_EMAIL]: 'email',
  [ContactType.WORK_EMAIL]: 'email'
} as const;

// Add validation patterns for email
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  zipCode: '99999-999'
} as const;