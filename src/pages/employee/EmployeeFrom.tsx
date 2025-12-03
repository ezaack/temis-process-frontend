import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
  Grid,
} from '@mui/material';

import { PersonalDataSection } from '../../features/client/component/PersonalDataSection';
import { toast } from 'react-toastify';
import { ContactType, PersonType } from '../../components/shared/enums';
import { Employee } from '../../features/employee/api/api-types';
import { employeeService } from '../../features/employee/api/employee-service';


export function EmployeeForm() {

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Employee>({
    personalData: {
      name: '',
      namePart2: '',
      displayName: '',
      birthDate: null,
      personType: PersonType.NATURAL,
      contacts: [
        {
          type: ContactType.WORK_EMAIL,
          value:  null,
          mandatory: true
        }
      ],
      addresses: [],
      personalDocuments: []
    },
    employeeType: "",
    officeUnitIds: [],
    roles: []
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    console.log(' #### handler SignUp submit');
    e.preventDefault(); // Prevent the default form submission behavior

    const workEmail = formData.personalData.contacts?.find(
      contact => contact.type === ContactType.WORK_EMAIL
    );

    if (!formData.personalData.name || !workEmail?.value) {
      setError('All fields marked with (*) are required'); // Set an error message if validation fails
      return;
    }

    try {
      const signUpData = {
          personalData: {
            name: formData.personalData.name,
            namePart2: formData.personalData.namePart2,
            displayName: formData.personalData.displayName,
            birthDate: formData.personalData.birthDate,
            personType: formData.personalData.personType,
            contacts: formData.personalData.contacts,
            addresses: formData.personalData.addresses,
            personalDocuments: formData.personalData.personalDocuments,
          },
          employeeType: formData.employeeType,
          officeUnitIds: formData.officeUnitIds,
          roles: formData.roles
      };
      // Call the signup service
      
      console.log(' #### submiting the employee data');
      await employeeService.post(signUpData);
      toast.success('Colaborador inserido'); // Show success message
      navigate('/employees'); // Redirect to the login page after successful signup
    } catch (err) {
      console.error('Signup error:', err); // Log the error for debugging
    } finally{
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de colaborador
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <PersonalDataSection
              personalData={formData.personalData}
              onChange={(newPersonalData) => setFormData({
                ...formData,
                personalData: newPersonalData
              })}
              simplyfied={true}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Enviar'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </form>
    </Paper>
  );
};

export default EmployeeForm;
