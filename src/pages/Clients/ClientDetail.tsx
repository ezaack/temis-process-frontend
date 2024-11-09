import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Gavel as GavelIcon,
  History as HistoryIcon,
  FolderSpecial as FolderSpecialIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PersonType, EnumLabels, ContactType } from '../../components/shared/enums';

interface ClientDetailProps {
  id: string;
  client: {
    description: string;
    howDidYouHearAboutUs: string;
    personalData: {
      name: string;
      namePart2: string;
      displayName: string;
      birthDate: string;
      personType: PersonType;
      contacts: Array<{
        type: ContactType;
        value: string;
      }>;
      addresses: Array<{
        street: string;
        number: string;
        complement: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        addressType: string;
      }>;
      personalDocuments: Array<{
        type: string;
        value: string;
        issuingDate: string;
        issuingAgency: string;
      }>;
    };
  };
}

export function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientDetailProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v0/clients/${id}`);
        setClientData(response.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
        toast.error('Erro ao carregar detalhes do cliente');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientDetails();
    }
  }, [id]);

  if (loading) {
    return <Box>Loading...</Box>; // You could add a nice loading skeleton here
  }

  if (!clientData) {
    return <Box>Client not found</Box>;
  }

  const { client } = clientData;
  const isNaturalPerson = client.personalData.personType === PersonType.NATURAL;

  return (
    <Box sx={{ display: 'flex', maxWidth: '100vw' }}>
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        mr: '300px',
        maxWidth: 'calc(100vw - 300px)'
      }}>
        {/* Basic Information Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon />
            Informações Básicas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Tipo de Pessoa
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {EnumLabels.PersonType[client.personalData.personType]}
              </Typography>
            </Grid>
            {client.personalData.birthDate && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Data de Nascimento
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(client.personalData.birthDate).toLocaleDateString()}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Descrição
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {client.description || 'Não informado'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Canal de Aquisição
              </Typography>
              <Typography variant="body1">
                {client.howDidYouHearAboutUs || 'Não informado'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Documents Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon />
            Documentação
          </Typography>
          <Grid container spacing={2}>
            {client.personalData.personalDocuments.map((doc, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {EnumLabels.DocumentType[doc.type]}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {doc.value}
                  </Typography>
                  <Box sx={{ mt: 1, fontSize: '0.875rem' }}>
                    <Typography variant="caption" component="div">
                      Emissão: {new Date(doc.issuingDate).toLocaleDateString()}
                    </Typography>
                    {doc.issuingAgency && (
                      <Typography variant="caption" component="div">
                        Órgão Emissor: {doc.issuingAgency}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Contacts Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon />
            Informações de Contato
          </Typography>
          <List dense>
            {client.personalData.contacts.map((contact, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: 'grey.50',
                  mb: 1,
                  borderRadius: 1,
                  '&:last-child': { mb: 0 }
                }}
              >
                <ListItemIcon>
                  {contact.type.includes('EMAIL') ? <EmailIcon /> : <PhoneIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={contact.value}
                  secondary={EnumLabels.ContactType[contact.type]}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Addresses Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon />
            Endereços
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {client.personalData.addresses.map((address, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  position: 'relative'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    px: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  {EnumLabels.AddressType[address.addressType]}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, pr: 8 }}>
                  {address.street}, {address.number}
                  {address.complement && ` - ${address.complement}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.city} - {address.state}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CEP: {address.zipCode}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Processos Ativos Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <GavelIcon />
            Processos Ativos
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Nenhum processo ativo no momento
            </Typography>
          </Box>
          <Button
            startIcon={<FolderSpecialIcon />}
            variant="outlined"
            size="small"
          >
            Novo Processo
          </Button>
        </Paper>

        {/* Últimos Andamentos Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Últimos Andamentos
          </Typography>
          <List dense>
            {/* Mockup items */}
            <ListItem
              sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
              secondaryAction={
                <Typography variant="caption" color="text.secondary">
                  15/03/2024
                </Typography>
              }
            >
              <ListItemText
                primary="Audiência de Conciliação Designada"
                secondary="Processo nº 1234567-89.2024.8.26.0100"
              />
            </ListItem>
            <ListItem
              sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
              secondaryAction={
                <Typography variant="caption" color="text.secondary">
                  10/03/2024
                </Typography>
              }
            >
              <ListItemText
                primary="Petição Inicial Protocolada"
                secondary="Processo nº 9876543-21.2024.8.26.0100"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Documentos Jurídicos Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon />
            Documentos Jurídicos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2">
                  Procuração
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Assinado em: 01/03/2024
                </Typography>
                <Button size="small" sx={{ mt: 1 }}>
                  Visualizar
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2">
                  Contrato de Honorários
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Assinado em: 01/03/2024
                </Typography>
                <Button size="small" sx={{ mt: 1 }}>
                  Visualizar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Honorários e Pagamentos Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoneyIcon />
            Honorários e Pagamentos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Próximo Vencimento
                </Typography>
                <Typography variant="h6" color="primary">
                  R$ 1.500,00
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vencimento: 05/04/2024
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Pago
                </Typography>
                <Typography variant="h6" color="success.main">
                  R$ 4.500,00
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Últimos 12 meses
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Próximos Compromissos Card */}
        <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon />
            Próximos Compromissos
          </Typography>
          <List dense>
            <ListItem
              sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
              secondaryAction={
                <Chip label="Audiência" size="small" color="primary" variant="outlined" />
              }
            >
              <ListItemText
                primary="Audiência de Conciliação"
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      20/04/2024 às 14:00
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fórum Central - Sala 123
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <ListItem
              sx={{ bgcolor: 'grey.50', borderRadius: 1 }}
              secondaryAction={
                <Chip label="Reunião" size="small" color="secondary" variant="outlined" />
              }
            >
              <ListItemText
                primary="Reunião de Acompanhamento"
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      25/04/2024 às 10:00
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Escritório - Sala de Reuniões
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Fixed Right Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: 300,
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          borderLeft: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/clients')}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>
        </Box>

        {/* Client Info */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ 
            width: '100%',
            height: 120,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            {isNaturalPerson ? (
              <PersonIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            ) : (
              <BusinessIcon sx={{ fontSize: 64, color: 'secondary.main' }} />
            )}
          </Box>

          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {client.personalData.name}
          </Typography>
          {client.personalData.namePart2 && (
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              {client.personalData.namePart2}
            </Typography>
          )}
          {client.personalData.displayName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {client.personalData.displayName}
            </Typography>
          )}
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/client-form/${id}`)}
            sx={{ mb: 2 }}
          >
            Editar Cadastro
          </Button>
        </Box>

        {/* Quick Info */}
        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Tipo de Pessoa"
                secondary={EnumLabels.PersonType[client.personalData.personType]}
              />
            </ListItem>
            {client.personalData.birthDate && (
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Data de Nascimento"
                  secondary={new Date(client.personalData.birthDate).toLocaleDateString()}
                />
              </ListItem>
            )}
            {client.personalData.contacts[0] && (
              <ListItem>
                <ListItemIcon>
                  {client.personalData.contacts[0].type.includes('EMAIL') ? 
                    <EmailIcon /> : <PhoneIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary="Contato Principal"
                  secondary={client.personalData.contacts[0].value}
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Paper>
    </Box>
  );
} 