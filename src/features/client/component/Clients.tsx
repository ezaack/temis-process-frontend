import { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Tooltip,
  Skeleton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PersonType } from '../../../components/shared/enums';
import { useUserContext } from '../../../context/UserContext';
import { loggedInUser } from '../../auth/api/authService';
import { clientService } from '../api/clientService';

interface Client {
  id: string;
  client: {
    description: string;
    personalData: {
      name: string;
      namePart2: string;
      displayName: string;
      personType: PersonType;
      contacts: Array<{
        type: string;
        value: string;
      }>;
    };
  };
}

// Add new interface for the paged response
interface PagedResponse {
  count: number;
  pageSize: number;
  currentPageIndex: number;
  numberOfPages: number;
  content: Client[]; // This will hold the array of clients
}

interface Filters {
  name: string;
  document: string;
  personType: PersonType | '';
}

export function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    name: '',
    document: '',
    personType: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const fetchClients = async () => {
    do{
      if(!loggedInUser){
        console.log('skip call!!')
        continue;
      }
      console.log(loggedInUser);
    try {
      const response:any = await clientService.search({
        pageIndex: page,
        pageSize: rowsPerPage,
        example: {
          personalData: {
            name: filters.name || undefined,
            personType: filters.personType || undefined,
            personalDocuments: filters.document ? [{
              value: filters.document
            }] : undefined
          }
        }
      }
    );
      
      setClients(response.content || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }while(!loggedInUser);
  };

  useEffect(() => {
    fetchClients();
  }, [page, rowsPerPage, filters]);

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      try {
        await axios.delete(`http://localhost:8080/v0/clients?id=${clientToDelete}`);
        toast.success('Cliente excluído com sucesso');
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Erro ao excluir cliente');
      }
    }
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof Filters) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setPage(0);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/client-form')}
        >
          Novo Cliente
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nome"
              placeholder="Buscar por nome..."
              variant="outlined"
              value={filters.name}
              onChange={handleFilterChange('name')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Documento"
              placeholder="CPF/CNPJ..."
              variant="outlined"
              value={filters.document}
              onChange={handleFilterChange('document')}
            />
            <TextField
              select
              label="Tipo de Pessoa"
              value={filters.personType}
              onChange={handleFilterChange('personType')}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={PersonType.NATURAL}>Pessoa Física</MenuItem>
              <MenuItem value={PersonType.LEGAL}>Pessoa Jurídica</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Client List */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Contatos</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Nenhum cliente encontrado
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((clientData) => (
                <TableRow 
                  key={clientData.id} 
                  hover 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/clients/${clientData.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      {clientData.client.personalData.personType === PersonType.NATURAL ? (
                        <PersonIcon color="action" />
                      ) : (
                        <BusinessIcon color="action" />
                      )}
                      <Box>
                        <Typography>
                          {clientData.client.personalData.name}
                          {clientData.client.personalData.personType === PersonType.NATURAL && 
                            ` ${clientData.client.personalData.namePart2 || ''}`
                          }
                        </Typography>
                        {clientData.client.personalData.personType === PersonType.LEGAL && 
                          <Typography variant="body2" color="text.secondary">
                            {clientData.client.personalData.displayName || ''}
                          </Typography>
                        }
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={clientData.client.personalData.personType === PersonType.NATURAL ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      size="small"
                      color={clientData.client.personalData.personType === PersonType.NATURAL ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{clientData.client.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {clientData.client.personalData.contacts?.map((contact, index) => (
                        <Tooltip key={index} title={contact.type}>
                          <Chip
                            label={contact.value}
                            size="small"
                            variant="outlined"
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/client-form/${clientData.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(clientData.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Itens por página"
        />
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}