import { DocumentType, ContactType, AddressType, Country, PersonType } from '../shared/enums';

export interface PersonalDocument {
  type: DocumentType;
  value: string | null;
  issuingDate: Date | null;
  issuingAgency: string | null;
}

export interface Contact {
  type: ContactType;
  value: string | null;
}

export interface Address {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: Country;
  zipCode: string | null;
  addressType: AddressType;
}

export interface Representative {
  representativeType: 'PROXY' | 'ATTOURNEY_IN_FACT' | 'LEGAL_GUARDIAN' | 'CURATOR' | 
    'LEGAL_REPRESENTATIVE' | 'ADMINISTRATOR' | 'MANAGER' | 'DIRECTOR' | 'CEO' | 
    'CFO' | 'PRESIDENT' | 'BOARD_MEMBER';
  personalData: PersonalData;
}

export interface PersonalData {
  name: string | null;
  namePart2: string | null;
  displayName: string | null;
  birthDate: string | null;
  personType: PersonType | undefined;
  contacts: Contact[];
  addresses: Address[];
  personalDocuments: PersonalDocument[];
  representatives: Representative[];
} 