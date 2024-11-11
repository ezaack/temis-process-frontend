import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  InputLabel,
  Stack} from '@mui/material';
import { DocumentType, EnumLabels, PersonType, ContactType, AddressType, Country } from '../../components/shared/enums';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { PersonalDataSection } from '../../components/ClientForm/PersonalDataSection';

interface Contact {
  type: ContactType;
  value: string;
}

interface Address {
  street: string | null;
  complement: string | null;
  number: string | null;
  country: Country;
  state: string | null;
  city: string | null;
  addressType: AddressType;
  zipCode: string;
}

interface PersonalDocument {
  type: DocumentType;
  value: string | null;
  issuingDate: Date | null;
  issuingAgency: string;
}

interface Representative {
  representativeType: 'PROXY' | 'ATTOURNEY_IN_FACT' | 'LEGAL_GUARDIAN' | 'CURATOR' | 
    'LEGAL_REPRESENTATIVE' | 'ADMINISTRATOR' | 'MANAGER' | 'DIRECTOR' | 'CEO' | 
    'CFO' | 'PRESIDENT' | 'BOARD_MEMBER';
  personalData: {
    name: string | null;
    namePart2: string | null;
    displayName: string | null;
    birthDate: string | null;
    personType: PersonType | undefined;
    contacts: Contact[];
    addresses: Address[];
    personalDocuments: PersonalDocument[];
    representatives?: Representative[];
  };
}

export function ClientForm() {
  const { id } = useParams();

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
      representatives: Representative[];
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
    ],
      representatives: []
    }
  });

  const [selectedPersonType, setSelectedPersonType] = useState<PersonType>(PersonType.NATURAL);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8080/v0/clients/${id}`);
          setFormData(response.data.client);
          setSelectedPersonType(response.data.client.personalData.personType);
        } catch (error) {
          console.error('Error fetching client:', error);
          toast.error('Erro ao carregar dados do cliente');
        }
      }
    };

    fetchClient();
  }, [id]);

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
    console.log('Form Data Representatives:', formData.personalData.representatives);

    try {
      // Create a copy of the representatives first
      const mappedRepresentatives = formData.personalData.representatives.map(rep => {
        console.log('Processing representative:', rep);
        return {
          representativeType: rep.representativeType,
          personalData: {
            name: rep.personalData.name,
            namePart2: rep.personalData.namePart2,
            displayName: rep.personalData.displayName,
            birthDate: rep.personalData.birthDate,
            personType: rep.personalData.personType,
            contacts: rep.personalData.contacts?.map(contact => ({
              type: contact.type,
              value: contact.value
            })) || [],
            addresses: rep.personalData.addresses?.map(address => ({
              street: address.street,
              number: address.number,
              complement: address.complement,
              country: address.country,
              state: address.state,
              city: address.city,
              addressType: address.addressType,
              zipCode: address.zipCode
            })) || [],
            personalDocuments: rep.personalData.personalDocuments?.map(doc => ({
              type: doc.type,
              value: doc.value,
              issuingDate: doc.issuingDate ? format(doc.issuingDate, 'yyyy-MM-dd') : null,
              issuingAgency: doc.issuingAgency
            })) || [],
            representatives: [] // Empty array for nested representatives
          }
        };
      });

      console.log('Mapped Representatives:', mappedRepresentatives);

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
          })),
          representatives: mappedRepresentatives // Use the mapped representatives here
        }
      };

      console.log('Final Payload:', payload);

      const response = await axios({
        method: id ? 'put' : 'post',
        url: 'http://localhost:8080/v0/clients',
        data: id ? { id, client: payload } : payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        toast.success(`Cliente ${id ? 'atualizado' : 'criado'} com sucesso!`);
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(`Erro ao ${id ? 'atualizar' : 'criar'} cliente`);
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
              <TextField
                fullWidth
                label="Breve descrição do cliente"
                variant="outlined"
                placeholder="Insira uma breve descrição"
                value={formData.description ?? ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Box>

            <TextField
              fullWidth
              label="Como nos conheceu?"
              variant="outlined"
              placeholder="Pesquisa no google, campanhar de facebook, campanha de instagram etc"
              value={formData.howDidYouHearAboutUs ?? ''}
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
                        personType: newValue,
                        name: null,
                        namePart2: newValue === PersonType.NATURAL ? null : formData.personalData.namePart2,
                        displayName: newValue === PersonType.LEGAL ? null : formData.personalData.displayName
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

            <PersonalDataSection
              personalData={formData.personalData}
              onChange={(newPersonalData) => setFormData({
                ...formData,
                personalData: newPersonalData
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