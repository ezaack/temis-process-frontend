import { 
  Box, 
  TextField,
  Stack} from '@mui/material';
import { DocumentType, ContactType, AddressType, Country, PersonType } from '../shared/enums';
import { DocumentSection } from './DocumentSection';
import { ContactSection } from './ContactSection';
import { AddressSection } from './AddressSection';
import { RepresentativeSection } from './RepresentativeSection';
import { Representative } from './types';

interface PersonalDocument {
  type: DocumentType;
  value: string | null;
  issuingDate: Date | null;
  issuingAgency: string | null;
}

interface Contact {
  type: ContactType;
  value: string | null;
}

interface Address {
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

interface PersonalData {
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

interface PersonalDataSectionProps {
  personalData: PersonalData;
  onChange: (newPersonalData: PersonalData) => void;
}

export function PersonalDataSection({ 
  personalData, 
  onChange,
  isRepresentative = false
}: PersonalDataSectionProps & { isRepresentative?: boolean }) {
  const isNaturalPerson = personalData.personType === PersonType.NATURAL;

  const handleChange = (field: keyof PersonalData, value: any) => {
    console.log(`Updating personal data field: ${field}`, value);
    const updatedData = {
      ...personalData,
      [field]: value
    };
    console.log('Updated personal data:', updatedData);
    onChange(updatedData);
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            required
            label={isNaturalPerson ? "Nome Próprio" : "Razão Social"}
            variant="outlined"
            placeholder={isNaturalPerson ? "João" : "Empresa LTDA"}
            value={personalData.name ?? ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            required
            label={isNaturalPerson ? "Sobrenome" : "Nome Fantasia"}
            variant="outlined"
            placeholder={isNaturalPerson ? "da Silva" : "Nome Fantasia"}
            value={personalData.namePart2 ?? ''}
            onChange={(e) => handleChange('namePart2', e.target.value)}
          />
        </Box>
      </Box>

      <DocumentSection
        documents={personalData.personalDocuments}
        onChange={(newDocuments) => handleChange('personalDocuments', newDocuments)}
      />

      <ContactSection
        contacts={personalData.contacts}
        onChange={(newContacts) => handleChange('contacts', newContacts)}
      />

      <AddressSection
        addresses={personalData.addresses}
        onChange={(newAddresses) => handleChange('addresses', newAddresses)}
      />

      {!isRepresentative && (
        <RepresentativeSection
          representatives={personalData.representatives}
          onChange={(newRepresentatives) => handleChange('representatives', newRepresentatives)}
        />
      )}
    </Stack>
  );
} 