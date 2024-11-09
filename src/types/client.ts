import { DocumentType, ContactType, AddressType, Country, PersonType } from '../components/shared/enums';

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

export interface ClientFormData {
  description: string | null;
  howDidYouHearAboutUs: string | null;
  personalData: {
    name: string | null;
    namePart2: string | null;
    displayName: string | null;
    birthDate: string | null;
    personType: PersonType | undefined;
    contacts: Contact[];
    addresses: Address[];
    personalDocuments: PersonalDocument[];
  };
} 