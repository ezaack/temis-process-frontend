import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactPhoneIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { officeService } from '../api/officeService';
import { 
  OfficeGroupResponse, 
  OfficeUnitResponse,
  OfficeContactType,
  OfficeAddressType,
  BrazilianState 
} from '../api/api-types';
import { loggedInUser } from '../../auth/api/authService';

// Enum labels for better presentation
const ContactTypeLabels: Record<OfficeContactType, string> = {
  CELL_PHONE: '📱 Celular',
  COMMERCIAL_EMAIL: '📧 E-mail Comercial',
  FINANCIAL_EMAIL: '📧 E-mail Financeiro',
  PEOPLE_MANAGEMENT_EMAIL: '📧 E-mail RH',
  MARKETING_EMAIL: '📧 E-mail Marketing',
  SAILS_EMAIL: '📧 E-mail Vendas',
  COMMERCIAL_PHONE: '📞 Telefone Comercial',
  FINANCIAL_PHONE: '📞 Telefone Financeiro',
  PEOPLE_MANAGEMENT_PHONE: '📞 Telefone RH',
  MARKETING_PHONE: '📞 Telefone Marketing',
  SAILS_PHONE: '📞 Telefone Vendas'
};

const AddressTypeLabels: Record<OfficeAddressType, string> = {
  MAIL_BOX: '📫 Caixa Postal',
  RECEPTION: '🏢 Recepção',
  OFFICE_ADDRESS: '🏢 Endereço Principal'
};

export function OfficeDetail() {
  const navigate = useNavigate();
  const [officeGroup, setOfficeGroup] = useState<OfficeGroupResponse | null>(null);
  const [officeUnits, setOfficeUnits] = useState<OfficeUnitResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if(!loggedInUser){
        console.error('No logged in user information found')
        return;
      }
      try {
        const officeGroupResponse = await officeService.fetchGroupById(loggedInUser?.userData.officeGroupId);
        console.log("#### Office group: ", officeGroupResponse);
        setOfficeGroup(officeGroupResponse);
        const unitsResponse = await officeService.searchUnits(loggedInUser?.userData.officeGroupId, {
          pageIndex: 0,
          pageSize: 100,
          example: {} as any
        });
        console.log("#### Office units: ", officeGroupResponse);
        setOfficeUnits(unitsResponse.content || []);
      } catch (error) {
        console.error('Error fetching office data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (!officeGroup) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Escritório não encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Office Group Header Card */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(to right, #1a237e, #283593)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BusinessIcon fontSize="large" />
            {officeGroup.officeGroupData.displayName}
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/office-form/${officeGroup.id}`)}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
          >
            Editar Escritório
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
              Nome do Grupo
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {officeGroup.officeGroupData.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
              Registro
            </Typography>
            <Typography variant="h6">
              {officeGroup.officeGroupData.registrationNumber}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Office Units Section */}
      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <StoreIcon />
        Unidades do Escritório ({officeUnits.length})
      </Typography>

      {officeUnits.map((unit, index) => (
        <Accordion 
          key={unit.id} 
          sx={{ 
            mb: 2,
            '&:before': {
              display: 'none',
            },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: 'primary.light',
              color: 'white',
              '&:hover': { bgcolor: 'primary.main' }
            }}
          >
            <Typography sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StoreIcon fontSize="small" />
              {unit.officeUnitData.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Registro da Unidade
                  </Typography>
                  <Typography variant="h6">
                    {unit.officeUnitData.registrationNumber}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Contacts Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContactPhoneIcon />
                  Contatos
                </Typography>
                <Grid container spacing={2}>
                  {unit.officeUnitData.contacts.map((contact, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {contact.value}
                        </Typography>
                        <Chip 
                          label={ContactTypeLabels[contact.type]}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Addresses Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon />
                  Endereços
                </Typography>
                <Grid container spacing={2}>
                  {unit.officeUnitData.addresses.map((address, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6">
                            {address.street}, {address.number}
                          </Typography>
                          <Chip 
                            label={AddressTypeLabels[address.addressType]}
                            color="primary"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          {address.complement && `${address.complement} - `}
                          {address.city}, {BrazilianState[address.state]}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          CEP: {address.zipCode}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
} 