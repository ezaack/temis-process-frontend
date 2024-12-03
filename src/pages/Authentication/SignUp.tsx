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

import { SignUpData } from '../../features/auth/api/api-types';
import { PersonalDataSection } from '../../features/client/component/PersonalDataSection';
import { OfficeGroupSection } from '../../features/office/component/OfficeGroupSection';
import { authService } from '../../features/auth/api/authService';
import { toast } from 'react-toastify';
import OfficeUnitSection from '../../features/office/component/OfficeUnitSection';
import { ContactType, PersonType } from '../../components/shared/enums';


export function SignUp() {

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SignUpData>({
    customerData: {
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
    officeGroupData: {
      name: '',
      displayName: '',
      registrationNumber: '',
    },
    groupMatrixUnitData: {
      name: '',
      registrationNumber: '',
      contacts: [],
      addresses: []
    },
    signUpData: {
      login: '',
      password: ''
    }
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    console.log(' #### handler SignUp submit');
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate the form data
    if (!formData.signUpData.login || 
      !formData.signUpData.password || 
      !formData.customerData.name) {
      setError('All fields marked with (*) are required'); // Set an error message if validation fails
      return;
    }

    try {
      // Prepare the sign-up data
      const signUpData = {
        customerData: {
          name: formData.customerData.name,
          namePart2: formData.customerData.namePart2,
          displayName: formData.customerData.displayName,
          birthDate: formData.customerData.birthDate,
          personType: formData.customerData.personType,
          contacts: formData.customerData.contacts,
          addresses: formData.customerData.addresses,
          personalDocuments: formData.customerData.personalDocuments,
        },
        officeGroupData: {
          name: formData.officeGroupData.name,
          displayName: formData.officeGroupData.displayName,
          registrationNumber: formData.officeGroupData.registrationNumber,
        },
        groupMatrixUnitData: {
          name: formData.groupMatrixUnitData.name,
          registrationNumber: formData.groupMatrixUnitData.registrationNumber,
          contacts: formData.groupMatrixUnitData.contacts,
          addresses: formData.groupMatrixUnitData.addresses,
        },
        signUpData: {
          login: formData.signUpData.login,
          password: formData.signUpData.password,
        },
      };
      // Call the signup service
      
      console.log(' #### submiting the SignUp data');
      await authService.signUp(signUpData);
      toast.success('Sign up successful! Redirecting to login...'); // Show success message
      navigate('/signin'); // Redirect to the login page after successful signup
    } catch (err) {
      setError('Signup failed. Please try again.'); // Set an error message if signup fails
      console.error('Signup error:', err); // Log the error for debugging
    } finally{
      
      console.log(' #### SignUp finished');
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <PersonalDataSection
              personalData={formData.customerData}
              onChange={(newPersonalData) => setFormData({
                ...formData,
                customerData: newPersonalData
              })}
            />
                        <Grid item xs={12}>
              <TextField
                fullWidth
                label="Login"
                variant="outlined"
                value={formData.signUpData.login}
                onChange={(e) => setFormData({
                  ...formData,
                  signUpData: {
                    ...formData.signUpData,
                    login: e.target.value
                  }
                })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={formData.signUpData.password}
                onChange={(e) => setFormData({
                  ...formData,
                  signUpData: {
                    ...formData.signUpData,
                    password: e.target.value
                  }
                })}
                required
              />
            </Grid>
             <Typography variant="h6" gutterBottom>
              Dados do Escritório
            </Typography>
            <OfficeGroupSection
              officeGroupData={formData.officeGroupData}
              onChange={(newData) => setFormData({
                ...formData,
                officeGroupData: newData
              })}
            />
            <OfficeUnitSection
              officeUnits={[formData.groupMatrixUnitData]}
              onChange={(newUnits) => setFormData({
                ...formData,
                groupMatrixUnitData: newUnits[0]
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
                {isSubmitting ? 'Salvando...' : 'Enviar'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </form>
    </Paper>
  );
};

export default SignUp;
