import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { OfficeUnitResource } from '../api/api-types';
import { OfficeUnitForm } from './OfficeUnitForm';

interface OfficeUnitSectionProps {
  officeUnits: OfficeUnitResource[];
  onChange: (units: OfficeUnitResource[]) => void;
}

export function OfficeUnitSection({ officeUnits, onChange }: OfficeUnitSectionProps) {
  const handleAddUnit = () => {
    onChange([
      ...officeUnits,
      {
        name: '',
        registrationNumber: '',
        contacts: [],
        addresses: []
      }
    ]);
  };

  const handleRemoveUnit = (index: number) => {
    const newUnits = [...officeUnits];
    newUnits.splice(index, 1);
    onChange(newUnits);
  };

  const handleUnitChange = (index: number, updatedUnit: OfficeUnitResource) => {
    const newUnits = [...officeUnits];
    newUnits[index] = updatedUnit;
    onChange(newUnits);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Unidades</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUnit}
        >
          Adicionar Unidade
        </Button>
      </Box>

      <Stack spacing={3}>
        {officeUnits.map((unit, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveUnit(index)}
              >
                Remover Unidade
              </Button>
            </Box>
            <OfficeUnitForm
              unit={unit}
              onChange={(updatedUnit) => handleUnitChange(index, updatedUnit)}
            />
            {index < officeUnits.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
} 