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