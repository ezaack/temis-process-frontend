import { 
  Box, 
  TextField,
  Stack} from '@mui/material';
import { DocumentSection } from './DocumentSection';
import { ContactSection } from './ContactSection';
import { AddressSection } from './AddressSection';
import { PersonalDataResource } from '../api/api-types';
import { PersonType } from '../../../components/shared/enums';

interface PersonalDataSectionProps {
  personalData: PersonalDataResource;
  onChange: (newPersonalData: PersonalDataResource) => void;
  isRepresentative?: boolean;
}

export function PersonalDataSection({ 
  personalData, 
  onChange,
  isRepresentative = false
}: PersonalDataSectionProps) {
  const isNaturalPerson = personalData.personType === PersonType.NATURAL;

  const handleChange = (field: keyof PersonalDataResource, value: any) => {
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

    </Stack>
  );
} 