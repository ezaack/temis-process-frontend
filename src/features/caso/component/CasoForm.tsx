import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import { casoService } from '../api/casoService';
import { CasoResource, UpdateCasoRequest, CasoEmployeeResource } from '../api/api-types';
import { clientService } from '../../client/api/clientService';
import { employeeService } from '../../employee/api/employee-service';
import { loggedInUser } from '../../auth/api/authService';

interface ClientOption {
  id: string;
  name: string;
  officeUnitId?: string; // Add this field for filtering
}

interface EmployeeOption {
  id: string;
  name: string;
}

interface EmployeeWithPermissions extends EmployeeOption {
  assigned: boolean;
  writePermission: boolean;
}

export const CasoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const officeGroupId = loggedInUser?.userData.officeGroupId || '';

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [officeUnitId, setOfficeUnitId] = useState('');
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeWithPermissions[]>([]);
  
  // Autocomplete options
  const [allClients, setAllClients] = useState<ClientOption[]>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeOption[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch available office units (from user context)
  const availableOfficeUnits = loggedInUser?.userData.officeUnits || [];

  // Load existing caso if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadCaso();
    }
  }, [isEditMode, id]);

  const loadCaso = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const caso = await casoService.getCaso(officeGroupId, id);
      setTitle(caso.titulo || '');
      setDescription(caso.descricao || '');
      setOfficeUnitId(caso.officeUnitId || '');
      
      // Load clients
      const clients: ClientOption[] = await Promise.all(
        caso.clientIds?.map(async (clientId) => {
          try {
            const clientData = await clientService.fetchById(clientId);
            return {
              id: clientId,
              name: clientData.client?.personalData?.displayName || clientData.client?.personalData?.name || clientId
            };
          } catch {
            return { id: clientId, name: clientId };
          }
        }) || []
      );
      setSelectedClients(clients);
      
      // Load employees with permissions
      const employees: EmployeeWithPermissions[] = await Promise.all(
        caso.employees?.map(async (emp) => {
          try {
            const searchResult: any = await employeeService.search({ 
              pageIndex: 0, 
              pageSize: 1, 
              example: {
                id: emp.employeeId
              }
            });
            const empData = searchResult.content?.[0];
            return {
              id: emp.employeeId,
              name: empData?.personalData?.displayName || empData?.personalData?.name || emp.employeeId,
              assigned: emp.assigned || false,
              writePermission: emp.writePermission || false
            };
          } catch {
            return {
              id: emp.employeeId,
              name: emp.employeeId,
              assigned: emp.assigned || false,
              writePermission: emp.writePermission || false
            };
          }
        }) || []
      );
      setSelectedEmployees(employees);
      
    } catch (error: any) {
      console.error('Error loading caso:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao carregar caso';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsForUnit = async (unitId: string) => {
    if (!unitId) {
      setAllClients([]);
      return;
    }
    
    setLoadingData(true);
    try {
      // Fetch all clients with large page size
      const result: any = await clientService.search({
        pageIndex: 0,
        pageSize: 1000, // Fetch all in one page
        example: {}
      });
      
      // Transform to ClientOption format
      const clients: ClientOption[] = result.content?.map((client: any) => ({
        id: client.id,
        name: client.client?.personalData?.displayName || 
              client.client?.personalData?.name || 
              'Sem nome',
        officeUnitId: client.client?.officeUnitId
      })) || [];
      
      // Filter by selected office unit in memory
      const filteredClients = clients.filter(c => c.officeUnitId === unitId);
      setAllClients(filteredClients);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error('Erro ao carregar clientes');
      setAllClients([]);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchEmployeesForUnit = async (unitId: string) => {
    if (!unitId) {
      setAllEmployees([]);
      return;
    }
    
    setLoadingData(true);
    try {
      const employees = await employeeService.listEmployeesByUnit(unitId);
      
      // Transform to EmployeeOption format
      const options: EmployeeOption[] = employees.map((emp: any) => ({
        id: emp.id,
        name: emp.employee?.personalData?.displayName || 
              emp.employee?.personalData?.name || 
              'Sem nome'
      }));
      
      setAllEmployees(options);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast.error('Erro ao carregar colaboradores');
      setAllEmployees([]);
    } finally {
      setLoadingData(false);
    }
  };

  // Filter clients based on search input
  const filterClients = (searchText: string): ClientOption[] => {
    if (!searchText || searchText.length < 2) {
      return allClients;
    }
    
    const lowerSearch = searchText.toLowerCase();
    return allClients.filter(client => 
      client.name.toLowerCase().includes(lowerSearch)
    );
  };

  // Filter employees based on search input
  const filterEmployees = (searchText: string): EmployeeOption[] => {
    if (!searchText || searchText.length < 2) {
      return allEmployees;
    }
    
    const lowerSearch = searchText.toLowerCase();
    return allEmployees.filter(emp => 
      emp.name.toLowerCase().includes(lowerSearch)
    );
  };

  useEffect(() => {
    if (officeUnitId) {
      fetchClientsForUnit(officeUnitId);
      fetchEmployeesForUnit(officeUnitId);
    } else {
      setAllClients([]);
      setAllEmployees([]);
    }
  }, [officeUnitId]);

  // Handle employee selection
  const handleEmployeeSelect = (employee: EmployeeOption) => {
    if (!selectedEmployees.find(e => e.id === employee.id)) {
      setSelectedEmployees([...selectedEmployees, {
        ...employee,
        assigned: true,
        writePermission: false
      }]);
    }
  };

  // Handle employee removal
  const handleEmployeeRemove = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.filter(e => e.id !== employeeId));
  };

  // Toggle employee permissions
  const handleToggleAssigned = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.map(emp =>
      emp.id === employeeId ? { ...emp, assigned: !emp.assigned } : emp
    ));
  };

  const handleToggleWritePermission = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.map(emp =>
      emp.id === employeeId ? { ...emp, writePermission: !emp.writePermission } : emp
    ));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return false;
    }
    if (!officeUnitId) {
      toast.error('Unidade do escritório é obrigatória');
      return false;
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const employees: CasoEmployeeResource[] = selectedEmployees.map(emp => ({
        employeeId: emp.id,
        assigned: emp.assigned,
        writePermission: emp.writePermission
      }));

      const clientIds = selectedClients.map(c => c.id);

      if (isEditMode && id) {
        // Update existing caso
        const updateData: UpdateCasoRequest = {
          id,
          title,
          description,
          officeUnitId,
          employees,
          clientIds
        };
        
        const updated = await casoService.updateCaso(officeGroupId, id, updateData);
        toast.success('Caso atualizado com sucesso');
        navigate(`/casos/${updated.id}`);
      } else {
        // Create new caso
        const createData: CasoResource = {
          title,
          description,
          officeUnitId,
          employees,
          clientIds
        };
        
        const created = await casoService.criarCaso(officeGroupId, createData);
        toast.success('Caso criado com sucesso');
        navigate(`/casos/${created.id}`);
      }
    } catch (error: any) {
      console.error('Error saving caso:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar caso');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Carregando caso...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Erro ao Carregar
          </h2>
        </div>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            ⚠️ {error}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => navigate('/casos')}>
              Voltar para Lista
            </Button>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Custom Breadcrumb for Form */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {isEditMode ? 'Editar Caso' : 'Novo Caso'}
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" to="/casos">
                Casos /
              </Link>
            </li>
            <li className="font-medium text-primary">
              {isEditMode ? 'Editar' : 'Novo'}
            </li>
          </ol>
        </nav>
      </div>

    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {isEditMode ? 'Editar Caso' : 'Criar Novo Caso'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6.5">
        <Stack spacing={3}>
          {/* Title */}
          <TextField
            label="Título"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />

          {/* Description */}
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />

          {/* Office Unit */}
          <FormControl fullWidth required>
            <InputLabel>Unidade do Escritório</InputLabel>
            <Select
              value={officeUnitId}
              onChange={(e) => setOfficeUnitId(e.target.value)}
              label="Unidade do Escritório"
              disabled={submitting}
            >
              {availableOfficeUnits.map((unit: any) => (
                <MenuItem key={unit.officeUnitId} value={unit.officeUnitId}>
                  {unit.officeUnitName || unit.officeUnitId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Clients */}
          <Autocomplete
            multiple
            options={allClients}
            value={selectedClients}
            onChange={(_, newValue) => setSelectedClients(newValue)}
            filterOptions={(_, state) => {
              return filterClients(state.inputValue);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={loadingData}
            disabled={submitting}
            noOptionsText={
              !officeUnitId 
                ? 'Selecione uma unidade primeiro' 
                : 'Nenhum cliente encontrado'
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clientes"
                placeholder={
                  !officeUnitId 
                    ? 'Selecione uma unidade primeiro' 
                    : 'Digite para filtrar clientes...'
                }
                helperText={
                  !officeUnitId 
                    ? 'Selecione uma unidade de escritório primeiro'
                    : 'Digite para filtrar a lista'
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: params.InputProps.endAdornment,
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />

          {/* Employees */}
          <Box>
            <Autocomplete
              options={allEmployees}
              filterOptions={(_, state) => {
                return filterEmployees(state.inputValue);
              }}
              onChange={(_, value) => {
                if (value) {
                  handleEmployeeSelect(value);
                  // Clear the input after selection
                }
              }}
              getOptionLabel={(option) => option.name}
              loading={loadingData}
              disabled={submitting || !officeUnitId}
              noOptionsText={
                !officeUnitId 
                  ? 'Selecione uma unidade primeiro' 
                  : 'Nenhum colaborador encontrado'
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Adicionar Colaboradores"
                  placeholder={
                    !officeUnitId 
                      ? 'Selecione uma unidade primeiro' 
                      : 'Digite para filtrar colaboradores...'
                  }
                  helperText={
                    !officeUnitId 
                      ? 'Selecione uma unidade de escritório primeiro'
                      : 'Digite para filtrar a lista'
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: params.InputProps.endAdornment,
                  }}
                />
              )}
            />

            {/* Selected Employees with Permissions */}
            {selectedEmployees.length > 0 && (
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Colaboradores Selecionados
                </Typography>
                <Stack spacing={2}>
                  {selectedEmployees.map((emp) => (
                    <Box
                      key={emp.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1
                      }}
                    >
                      <Typography sx={{ flex: 1 }}>{emp.name}</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emp.assigned}
                            onChange={() => handleToggleAssigned(emp.id)}
                            disabled={submitting}
                          />
                        }
                        label="Atribuído"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emp.writePermission}
                            onChange={() => handleToggleWritePermission(emp.id)}
                            disabled={submitting}
                          />
                        }
                        label="Permissão de Escrita"
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleEmployeeRemove(emp.id)}
                        disabled={submitting}
                      >
                        Remover
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Box>

          {/* Actions */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate('/casos')}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting && <CircularProgress size={20} />}
            >
              {submitting ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')}
            </Button>
          </Box>
        </Stack>
      </form>
    </div>
    </Box>
  );
};
