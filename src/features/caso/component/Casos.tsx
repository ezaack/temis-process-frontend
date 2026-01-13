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
  Tooltip,
  Skeleton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loggedInUser } from '../../auth/api/authService';
import { casoService } from '../api/casoService';
import type { CasoDetailResource } from '../api/api-types';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface Filters {
  title: string;
  clientId: string;
  employeeId: string;
  officeUnitId: string;
}

export const Casos: React.FC = () => {
  const navigate = useNavigate();
  const [casos, setCasos] = useState<CasoDetailResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    title: '',
    clientId: '',
    employeeId: '',
    officeUnitId: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [casoToDelete, setCasoToDelete] = useState<string | null>(null);

  const fetchCasos = async () => {
    if (!loggedInUser?.userData?.officeGroupId) {
      console.log('No user or officeGroupId available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await casoService.searchCasos(
        loggedInUser.userData.officeGroupId,
        {
          title: filters.title || undefined,
          clientId: filters.clientId || undefined,
          employeeId: filters.employeeId || undefined,
          officeUnitId: filters.officeUnitId || undefined,
          page: page,
          size: rowsPerPage,
        }
      );

      setCasos(response.content || []);
      setTotalCount(response.totalElements || 0);
    } catch (error) {
      console.error('Error fetching casos:', error);
      toast.error('Erro ao carregar casos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasos();
  }, [page, rowsPerPage, filters]);

  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCasoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (casoToDelete && loggedInUser?.userData?.officeGroupId) {
      try {
        await casoService.deleteCaso(
          loggedInUser.userData.officeGroupId,
          casoToDelete
        );
        toast.success('Caso excluído com sucesso');
        fetchCasos();
      } catch (error) {
        console.error('Error deleting caso:', error);
        toast.error('Erro ao excluir caso');
      }
    }
    setDeleteDialogOpen(false);
    setCasoToDelete(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange =
    (field: keyof Filters) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setPage(0);
    };

  const handleRowClick = (casoId: string) => {
    navigate(`/casos/${casoId}`);
  };

  const handleEditClick = (casoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/caso-form/${casoId}`);
  };

  return (
    <Box>
      {/* Breadcrumb */}
      <Breadcrumb pageName="Casos" />

      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Casos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/caso-form')}
        >
          Novo Caso
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Título"
              placeholder="Buscar por título..."
              variant="outlined"
              value={filters.title}
              onChange={handleFilterChange('title')}
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Cliente ID"
              placeholder="ID do cliente..."
              variant="outlined"
              value={filters.clientId}
              onChange={handleFilterChange('clientId')}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Colaborador ID"
              placeholder="ID do colaborador..."
              variant="outlined"
              value={filters.employeeId}
              onChange={handleFilterChange('employeeId')}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Unidade ID"
              placeholder="ID da unidade..."
              variant="outlined"
              value={filters.officeUnitId}
              onChange={handleFilterChange('officeUnitId')}
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Casos Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell>Clientes</TableCell>
              <TableCell>Colaboradores</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            ) : casos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Nenhum caso encontrado
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              casos.map((caso) => (
                <TableRow
                  key={caso.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(caso.id)}
                >
                  <TableCell>
                    <Typography fontWeight="medium">{caso.titulo}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        maxWidth: 300,
                      }}
                    >
                      {caso.descricao}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{caso.officeUnitId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {caso.clientIds?.length || 0} cliente(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {caso.employees?.length || 0} colaborador(es)
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                      }}
                    >
                      <Tooltip title="Visualizar">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(caso.id);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={(e) => handleEditClick(caso.id, e)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleDeleteClick(caso.id, e)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este caso? Esta ação não pode ser
          desfeita.
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
};
