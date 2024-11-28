import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { toast } from 'react-toastify';

import { OfficeGroupResource, OfficeUnitResource } from '../api/api-types';
import { OfficeGroupSection } from './OfficeGroupSection';
import OfficeUnitSection from './OfficeUnitSection';

export function OfficeForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    officeGroupData: OfficeGroupResource;
    officeUnits: OfficeUnitResource[];
  }>({
    officeGroupData: {
      name: '',
      displayName: '',
      registrationNumber: ''
    },
    officeUnits: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First create the office group
      const groupResponse = await officeService.createGroup(formData.officeGroupData);

      // Then create each office unit
      for (const unit of formData.officeUnits) {
        await officeService.createUnit(groupResponse.id, unit);
      }

      toast.success('Escritório criado com sucesso!');
      navigate('/offices');
    } catch (error) {
      console.error('Error saving office:', error);
      toast.error('Erro ao criar escritório');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.officeGroupData.name) {
      toast.error('Nome do grupo é obrigatório');
      return false;
    }
    return true;
  };

  return (
    <Paper elevation={1}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
        <Typography variant="h6">
          Novo Escritório
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <OfficeGroupSection
              officeGroupData={formData.officeGroupData}
              onChange={(newData) => setFormData({
                ...formData,
                officeGroupData: newData
              })}
            />

            <OfficeUnitSection
              officeUnits={formData.officeUnits}
              onChange={(newUnits) => setFormData({
                ...formData,
                officeUnits: newUnits
              })}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Escritório'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </form>
    </Paper>
  );
} 