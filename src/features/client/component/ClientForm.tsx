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
  Stack,
  Select,
  MenuItem} from '@mui/material';
import { EnumLabels, PersonType } from '../../../components/shared/enums';
import { toast } from 'react-toastify';
import { PersonalDataSection } from './PersonalDataSection';
import { clientService } from '../api/clientService';
import { AddressResource, ContactResource, PersonalDocumentResource, RepresentativeResource } from '../api/api-types';
import { RepresentativeSection } from './RepresentativeSection';
import { OfficeUnitResource } from '../../office/api/api-types';
import { loggedInUser } from '../../auth/api/authService';





export function ClientForm() {
  const { id } = useParams();

  const [formData, setFormData] = useState<{
    description: string | null;
    howDidYouHearAboutUs: string | null;
    officeUnitId: string | undefined;
    personalData: {
      name: string | null;
      namePart2: string | null;
      displayName: string | null;
      birthDate: string | null;
      personType: PersonType | undefined;
      contacts: ContactResource[];
      addresses: AddressResource[];
      personalDocuments: PersonalDocumentResource[];
    };
    representatives: RepresentativeResource[];
  }>({
    description: null,
    howDidYouHearAboutUs: null,
    officeUnitId: loggedInUser?.userData.officeUnits.at(0)?.officeUnitId,
    personalData: {
      name: null,
      namePart2: null,
      displayName: null,
      birthDate: null,
      personType: undefined,
      contacts: [],
      addresses: [],
      personalDocuments: []
    },
    representatives: []
  });

  const [selectedPersonType, setSelectedPersonType] = useState<PersonType>(PersonType.NATURAL);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        try {
          const response = await clientService.fetchById(id);
          setFormData({
            description: response.client.description,
            howDidYouHearAboutUs: response.client.howDidYouHearAboutUs,
            representatives: response.representatives,
            personalData: {
              ...response.client.personalData,
            }
          });
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

    try {
      // Create the payload according to ClientCreateRequest/ClientUpdateRequest
      const payload = {
        client: {
          description: formData.description,
          howDidYouHearAboutUs: formData.howDidYouHearAboutUs,
          officeUnitId:formData.officeUnitId,
          personalData: {
            name: formData.personalData.name,
            namePart2: formData.personalData.namePart2,
            displayName: formData.personalData.displayName,
            birthDate: formData.personalData.birthDate,
            personType: formData.personalData.personType,
            contacts: formData.personalData.contacts,
            addresses: formData.personalData.addresses,
            personalDocuments: formData.personalData.personalDocuments
          }
        },
        representatives: formData.representatives.map(rep => ({
          representativeType: rep.representativeType,
          personalData: {
            name: rep.personalData.name,
            namePart2: rep.personalData.namePart2,
            displayName: rep.personalData.displayName,
            birthDate: rep.personalData.birthDate,
            personType: rep.personalData.personType,
            contacts: rep.personalData.contacts,
            addresses: rep.personalData.addresses,
            personalDocuments: rep.personalData.personalDocuments
          }
        }))
      };

      const response = await clientService[id ? 'update' : 'create'](
        id ? { id, ...payload } : payload
      );

      toast.success(`Cliente ${id ? 'atualizado' : 'criado'} com sucesso!`);
      navigate('/clients');
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
            <InputLabel sx={{ mb: 1 }}>Escritório</InputLabel>
            <Select
              fullWidth
              value={formData.howDidYouHearAboutUs ?? ''}
              onChange={(e) => setFormData({...formData, officeUnitId: e.target.value})}
            
            >
              {Object.values(loggedInUser?loggedInUser.userData.officeUnits:[]).map((unit) => (
                <MenuItem key={unit.officeUnitId} value={unit.officeUnitId}>
                  {unit.officeUnitName}
                </MenuItem>
              ))}
              </Select>

            </Box>

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
             <RepresentativeSection
              representatives={formData.representatives}
              onChange={(newRepresentatives) => setFormData(
                {
                  ...formData,
                  representatives: newRepresentatives
                }
              )}
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