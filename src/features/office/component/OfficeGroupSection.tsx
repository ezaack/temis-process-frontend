import {
  Box,
  TextField,
  Stack
} from '@mui/material';
import { OfficeGroupResource } from '../api/api-types';

interface OfficeGroupSectionProps {
  officeGroupData: OfficeGroupResource;
  onChange: (data: OfficeGroupResource) => void;
}

export function OfficeGroupSection({ officeGroupData, onChange }: OfficeGroupSectionProps) {
  const handleChange = (field: keyof OfficeGroupResource, value: string) => {
    onChange({
      ...officeGroupData,
      [field]: value
    });
  };

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Razão Social"
        value={officeGroupData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <TextField
        fullWidth
        required
        label="Nome nome Fantasia"
        value={officeGroupData.displayName}
        onChange={(e) => handleChange('displayName', e.target.value)}
      />

      <TextField
        fullWidth
        label="Número de Registro da empresa ou sociedade"
        value={officeGroupData.registrationNumber}
        onChange={(e) => handleChange('registrationNumber', e.target.value)}
      />
    </Stack>
  );
} 