import { AddressType, ContactType, Country, PersonType, RepresentativeType } from "../../../components/shared/enums";


// API Resource Types
export interface ClientResource {
  description: string | null;
  howDidYouHearAboutUs: string | null;
  personalData: PersonalDataResource;
}

export interface PersonalDataResource {
  name: string | null;
  namePart2: string | null;
  displayName: string | null;
  birthDate: string | null;
  personType: PersonType;
  contacts: ContactResource[];
  addresses: AddressResource[];
  personalDocuments: PersonalDocumentResource[];
}

export interface ContactResource {
  type: ContactType;
  value: string | null;
}

export interface AddressResource {
  street: string | null;
  number: string | null;
  complement: string | null;
  city: string | null;
  state: string | null;
  country: Country;
  zipCode: string | null;
  addressType: AddressType;
  asOf?: string | null;
}

export interface PersonalDocumentResource {
  type: DocumentType;
  value: string | null;
  issuingDate: string | null; // Changed from Date to string
  issuingAgency: string | null;
}

export interface RepresentativeResource {
  id?: string;
  representativeType: RepresentativeType;
  personalData: PersonalDataResource;
}

// Request/Response Types
export interface ClientCreateRequest {
  client: ClientResource;
  representatives: RepresentativeResource[];
}

export interface ClientUpdateRequest {
  id: string;
  client: ClientResource;
  representatives: RepresentativeResource[];
}

export interface ClientResponse {
  id: string;
  client: ClientResource;
  representatives: RepresentativeResource[];
} 

interface Representative {
    representativeType: RepresentativeType;
    personalData: PersonalDataResource;
  }
  