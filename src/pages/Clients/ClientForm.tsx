import { useState } from 'react';
import { 
  Paper,
  Container,
  Typography,
  Box,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Grid,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DocumentType, EnumLabels, PersonType, ContactType, AddressType, Country } from '../../components/shared/enums';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { DocumentSection } from '../../components/ClientForm/DocumentSection';
import { ContactSection } from '../../components/ClientForm/ContactSection';
import { AddressSection } from '../../components/ClientForm/AddressSection';

// Add this interface near the top of your file, before the ClientForm component
interface PersonalDocument {
  type: DocumentType;
  value: string | null
  issuingDate: Date | null;
  issuingAgency: string | null
}

// Add this interface
interface Contact {
  type: ContactType;
  value: string | null;
}

// Add this interface
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

export function ClientForm() {
  const [formData, setFormData] = useState<{
    description: string | null
    howDidYouHearAboutUs: string | null
    personalData: {
      name: string | null
      namePart2: string | null
      displayName: string | null
      birthDate: string | null
      personType: PersonType | undefined;
      contacts: Contact[];
      addresses: Address[];
      personalDocuments: PersonalDocument[];
    };
  }>({
    description: null,
    howDidYouHearAboutUs: null,
    personalData: {
      name: null,
      namePart2: null,
      displayName: null,
      birthDate: null,
      personType: undefined,
      contacts: [
        // { type: 'PERSONAL_CELL_PHONE', value: '' }
      ],
      addresses: [
      //   {
      //   street: null,
      //   complement: null,
      //   number: null,
      //   country: 'BRAZIL',
      //   state: null,
      //   city: null,
      //   addressType: 'HOME',
      //   zipCode: ''
      // }
    ],
      personalDocuments: [
      //   {
      //   type: 'CPF',
      //   value: null,
      //   issuingDate: null,
      //   issuingAgency: ''
      // }
    ]
    }
  });

  const [selectedPersonType, setSelectedPersonType] = useState<PersonType>(PersonType.NATURAL);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!formData.personalData.name) {
      toast.error('Nome é obrigatório');
      return false;
    }
    // Add other validations as needed
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform the form data to match API schema
      const payload = {
        description: formData.description,
        howDidYouHearAboutUs: formData.howDidYouHearAboutUs,
        personalData: {
          name: formData.personalData.name,
          namePart2: formData.personalData.namePart2,
          displayName: formData.personalData.displayName,
          birthDate: formData.personalData.birthDate,
          personType: formData.personalData.personType,
          contacts: formData.personalData.contacts.map(contact => ({
            type: contact.type,
            value: contact.value
          })),
          addresses: formData.personalData.addresses.map(address => ({
            street: address.street,
            number: address.number,
            complement: address.complement,
            country: address.country,
            state: address.state,
            city: address.city,
            addressType: address.addressType,
            zipCode: address.zipCode
          })),
          personalDocuments: formData.personalData.personalDocuments.map(doc => ({
            type: doc.type,
            value: doc.value,
            issuingDate: doc.issuingDate ? format(doc.issuingDate, 'yyyy-MM-dd') : null,
            issuingAgency: doc.issuingAgency
          }))
        }
      };

      // Make the API call
      const response = await axios.post('http://localhost:8080/v0/clients', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Handle success
        console.log('Client created successfully:', response.data);
        // You might want to show a success message or redirect
        toast.success('Cliente criado com sucesso!');
        // Optional: redirect to clients list
        // navigate('/clients');
      }
    } catch (error) {
      // Handle error
      console.error('Error creating client:', error);
      // Show error message to user
      toast.error('Erro ao criar cliente. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={1}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
        <Typography variant="h6">
          Novo Cliente
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InputLabel>Breve descrição do cliente</InputLabel>
                <Tooltip title="Uma breve explicação do cliente, como para qual empresa trabalha, ou uma desanbiguação para facilmente separa-lo de clientes homonimos">
                  <HelpOutlineIcon fontSize="small" color="action" />
                </Tooltip>
              </Box> */}
              <TextField
                fullWidth
                label="Breve descrição do cliente"
                variant="outlined"
                placeholder="Insira uma breve descrição"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Box>

            <TextField
              fullWidth
              label="Como nos conheceu?"
              variant="outlined"
              placeholder="Pesquisa no google, campanhar de facebook, campanha de instagram etc"
              value={formData.howDidYouHearAboutUs}
              onChange={(e) => setFormData({...formData, howDidYouHearAboutUs: e.target.value})}
            />

            <Box>
              <InputLabel sx={{ mb: 1 }}>Tipo de Pessoa</InputLabel>
              <ToggleButtonGroup
                color="primary"
                value={formData.personalData.personType}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setFormData({
                      ...formData,
                      personalData: {
                        ...formData.personalData,
                        personType: newValue
                      }
                    });
                  }
                }}
              >
                {Object.values(PersonType).map((personType) => (
                  <ToggleButton 
                    key={personType}
                    value={personType}
                    sx={{ px: 3 }}
                  >
                    {EnumLabels.PersonType[personType]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {/* Personal Data */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Nome Próprio"
                  variant="outlined"
                  placeholder="João"
                  value={formData.personalData.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalData: {...formData.personalData, name: e.target.value}
                  })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Sobrenome"
                  variant="outlined"
                  placeholder="da Silva"
                  value={formData.personalData.namePart2}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalData: {...formData.personalData, namePart2: e.target.value}
                  })}
                />
              </Box>
            </Box>

            <DocumentSection
              documents={formData.personalData.personalDocuments}
              onChange={(newDocuments) => setFormData({
                ...formData,
                personalData: {
                  ...formData.personalData,
                  personalDocuments: newDocuments
                }
              })}
            />

            <ContactSection
              contacts={formData.personalData.contacts}
              onChange={(newContacts) => setFormData({
                ...formData,
                personalData: {
                  ...formData.personalData,
                  contacts: newContacts
                }
              })}
            />

            <AddressSection
              addresses={formData.personalData.addresses}
              onChange={(newAddresses) => setFormData({
                ...formData,
                personalData: {
                  ...formData.personalData,
                  addresses: newAddresses
                }
              })}
            />

            {/* Submit Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </form>
    </Paper>
  );
} 