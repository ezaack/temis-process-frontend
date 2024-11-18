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
        required
        label="Nome do Grupo"
        value={officeGroupData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <TextField
        fullWidth
        required
        label="Nome de Exibição"
        value={officeGroupData.displayName}
        onChange={(e) => handleChange('displayName', e.target.value)}
      />

      <TextField
        fullWidth
        required
        label="Número de Registro"
        value={officeGroupData.registrationNumber}
        onChange={(e) => handleChange('registrationNumber', e.target.value)}
      />
    </Stack>
  );
} 