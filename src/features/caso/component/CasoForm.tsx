import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [officeUnitId, setOfficeUnitId] = useState('');
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeWithPermissions[]>([]);
  
  // Autocomplete options
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Debounce refs
  const clientSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const employeeSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch available office units (from user context)
  const availableOfficeUnits = loggedInUser?.userData.officeUnits || [];

  // Load existing caso if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadCaso();
    }
  }, [isEditMode, id]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (clientSearchTimeoutRef.current) {
        clearTimeout(clientSearchTimeoutRef.current);
      }
      if (employeeSearchTimeoutRef.current) {
        clearTimeout(employeeSearchTimeoutRef.current);
      }
    };
  }, []);

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
      
    } catch (error) {
      console.error('Error loading caso:', error);
      toast.error('Erro ao carregar caso');
    } finally {
      setLoading(false);
    }
  };

  // Search clients with debouncing
  const handleSearchClients = useCallback((searchText: string) => {
    // Clear previous timeout
    if (clientSearchTimeoutRef.current) {
      clearTimeout(clientSearchTimeoutRef.current);
    }

    // If search text is too short, clear options
    if (!searchText || searchText.length < 2) {
      setClientOptions([]);
      setLoadingClients(false);
      return;
    }

    // Set loading state
    setLoadingClients(true);

    // Debounce the search
    clientSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const result: any = await clientService.search({
          pageIndex: 0,
          pageSize: 20,
          example: {
            personalData: {
              name: searchText
            }
          }
        });
        
        const options = result.content?.map((client: any) => ({
          id: client.id,
          name: client.client?.personalData?.displayName || client.client?.personalData?.name || 'Sem nome'
        })) || [];
        
        setClientOptions(options);
      } catch (error) {
        console.error('Error searching clients:', error);
        toast.error('Erro ao buscar clientes');
      } finally {
        setLoadingClients(false);
      }
    }, 500); // 500ms debounce delay
  }, []);

  // Search employees with debouncing
  const handleSearchEmployees = useCallback((searchText: string) => {
    // Clear previous timeout
    if (employeeSearchTimeoutRef.current) {
      clearTimeout(employeeSearchTimeoutRef.current);
    }

    // If search text is too short, clear options
    if (!searchText || searchText.length < 2) {
      setEmployeeOptions([]);
      setLoadingEmployees(false);
      return;
    }

    // Set loading state
    setLoadingEmployees(true);

    // Debounce the search
    employeeSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const result: any = await employeeService.search({
          pageIndex: 0,
          pageSize: 20,
          example: {
            personalData: {
              name: searchText
            }
          }
        });
        
        const options = result.content?.map((emp: any) => ({
          id: emp.id,
          name: emp.personalData?.displayName || emp.personalData?.name || 'Sem nome'
        })) || [];
        
        setEmployeeOptions(options);
      } catch (error) {
        console.error('Error searching employees:', error);
        toast.error('Erro ao buscar colaboradores');
      } finally {
        setLoadingEmployees(false);
      }
    }, 500); // 500ms debounce delay
  }, []);

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
        <CircularProgress />
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
            options={clientOptions}
            value={selectedClients}
            onChange={(_, newValue) => setSelectedClients(newValue)}
            onInputChange={(_, value) => handleSearchClients(value)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={loadingClients}
            disabled={submitting}
            noOptionsText={loadingClients ? 'Buscando...' : 'Digite pelo menos 2 caracteres para buscar'}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clientes"
                placeholder="Digite para buscar clientes..."
                helperText="Digite pelo menos 2 caracteres para buscar"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingClients ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
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
              options={employeeOptions}
              onInputChange={(_, value) => handleSearchEmployees(value)}
              onChange={(_, value) => {
                if (value) {
                  handleEmployeeSelect(value);
                  // Clear the input after selection
                }
              }}
              getOptionLabel={(option) => option.name}
              loading={loadingEmployees}
              disabled={submitting}
              noOptionsText={loadingEmployees ? 'Buscando...' : 'Digite pelo menos 2 caracteres para buscar'}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Adicionar Colaboradores"
                  placeholder="Digite para buscar colaboradores..."
                  helperText="Digite pelo menos 2 caracteres para buscar"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
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
