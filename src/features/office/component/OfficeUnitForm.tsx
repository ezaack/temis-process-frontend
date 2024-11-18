import {
  Box,
  TextField,
  Stack
} from '@mui/material';
import { OfficeUnitResource } from '../api/api-types';
import { ContactSection } from '../../client/component/ContactSection';
import { AddressSection } from '../../client/component/AddressSection';

interface OfficeUnitFormProps {
  unit: OfficeUnitResource;
  onChange: (unit: OfficeUnitResource) => void;
}

export function OfficeUnitForm({ unit, onChange }: OfficeUnitFormProps) {
  const handleChange = (field: keyof OfficeUnitResource, value: any) => {
    onChange({
      ...unit,
      [field]: value
    });
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          required
          label="Nome da Unidade"
          value={unit.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <TextField
          fullWidth
          required
          label="Número de Registro"
          value={unit.registrationNumber}
          onChange={(e) => handleChange('registrationNumber', e.target.value)}
        />
      </Box>

      <ContactSection
        contacts={unit.contacts}
        onChange={(newContacts) => handleChange('contacts', newContacts)}
      />

      <AddressSection
        addresses={unit.addresses}
        onChange={(newAddresses) => handleChange('addresses', newAddresses)}
      />
    </Stack>
  );
} 