import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Skeleton,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useUserContext } from '../../../context/UserContext';
import { tarefaService } from '../api/tarefaService';
import { quadroService } from '../api/quadroService';
import { TarefaViewModal } from './TarefaViewModal';
import type {
  TarefaResource,
  StatusTarefaResource,
} from '../api/api-types';

interface CasoTaskListProps {
  casoId: string;
}

export const CasoTaskList: React.FC<CasoTaskListProps> = ({ casoId }) => {
  const { user } = useUserContext();
  const [tasks, setTasks] = useState<TarefaResource[]>([]);
  const [statuses, setStatuses] = useState<StatusTarefaResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedTarefaId, setSelectedTarefaId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const groupId = user?.userData?.officeGroupId;

  const handleRowClick = (taskId: string, e: React.MouseEvent) => {
    // Don't open modal when clicking interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('.MuiSelect-root') ||
      target.closest('input') ||
      target.closest('.MuiIconButton-root')
    ) {
      return;
    }
    
    setSelectedTarefaId(taskId);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedTarefaId(null);
  };

  const handleTaskUpdate = async () => {
    // Refresh tasks after update/delete
    await fetchData();
  };

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [casoId, groupId]);

  const fetchData = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError(null);
      // Fetch tasks
      const tasksData = await tarefaService.getTarefasByCaso(groupId, casoId);
      setTasks(tasksData);

      // Fetch statuses
      const quadroData = await quadroService.getQuadroTarefasByCaso(
        groupId,
        casoId
      );
      setStatuses(quadroData.statusTarefas || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao carregar tarefas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatusId: string) => {
    if (!groupId) return;

    try {
      await tarefaService.updateTarefa(groupId, taskId, { statusId: newStatusId });
      toast.success('Status atualizado com sucesso');
      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, statusId: newStatusId } : task
        )
      );
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status';
      toast.error(errorMessage);
      // Revert on error
      fetchData();
    }
  };

  const handleEditClick = (task: TarefaResource) => {
    setEditingTaskId(task.id || null);
    setEditedTitle(task.titulo);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!groupId || !editedTitle.trim()) return;

    try {
      // Use PATCH to update only the title field
      await tarefaService.updateTarefa(groupId, taskId, {
        titulo: editedTitle.trim()
      });
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, titulo: editedTitle.trim() } : task
        )
      );
      toast.success('Título atualizado com sucesso');
      setEditingTaskId(null);
    } catch (error: any) {
      console.error('Error updating title:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar título';
      toast.error(errorMessage);
      // Reload to revert on error
      fetchData();
      setEditingTaskId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const getPriorityLabel = (priority?: string): string => {
    const labels: Record<string, string> = {
      BAIXA: 'Baixa',
      MEDIA: 'Média',
      ALTA: 'Alta',
      URGENTE: 'Urgente',
    };
    return priority ? labels[priority] || priority : '-';
  };

  const getPriorityColor = (priority?: string): string => {
    const colors: Record<string, string> = {
      BAIXA: 'text-gray-600',
      MEDIA: 'text-blue-600',
      ALTA: 'text-orange-600',
      URGENTE: 'text-red-600',
    };
    return priority ? colors[priority] || '' : '';
  };

  if (loading) {
    return (
      <Box className="p-4">
        <Box className="flex items-center justify-center py-8">
          <Box className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto mb-4"></div>
            <Typography color="textSecondary">Carregando tarefas...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-8 text-center">
        <Typography variant="h6" color="error" gutterBottom>
          ⚠️ {error}
        </Typography>
        <button
          onClick={fetchData}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          🔄 Tentar Novamente
        </button>
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box className="p-8 text-center">
        <div className="text-5xl mb-4">📝</div>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Nenhuma tarefa encontrada
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Adicione tarefas usando o quadro Kanban para começar.
        </Typography>
      </Box>
    );
  }

  return (
    <>
    <TableContainer component={Paper} className="shadow-md">\n      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell>
              <strong>Título</strong>
            </TableCell>
            <TableCell>
              <strong>Responsável</strong>
            </TableCell>
            <TableCell>
              <strong>Prioridade</strong>
            </TableCell>
            <TableCell>
              <strong>Prazo</strong>
            </TableCell>
            <TableCell>
              <strong>Estimativa (h)</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Ações</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              hover 
              onClick={(e) => handleRowClick(task.id!, e)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                {editingTaskId === task.id ? (
                  <TextField
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    size="small"
                    fullWidth
                    autoFocus
                  />
                ) : (
                  <div>
                    <div className="font-medium">{task.titulo}</div>
                    {task.descricao && (
                      <div className="text-sm text-gray-500 mt-1">
                        {task.descricao}
                      </div>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {task.colaboradorId ? task.colaboradorId : '-'}
              </TableCell>
              <TableCell>
                <span className={getPriorityColor(task.prioridade)}>
                  {getPriorityLabel(task.prioridade)}
                </span>
              </TableCell>
              <TableCell>
                {task.prazo
                  ? new Date(task.prazo).toLocaleDateString('pt-BR')
                  : '-'}
              </TableCell>
              <TableCell>{task.estimativaHoras || '-'}</TableCell>
              <TableCell>
                <FormControl size="small" fullWidth>
                  <Select
                    value={task.statusId}
                    onChange={(e) =>
                      handleStatusChange(task.id!, e.target.value)
                    }
                    disabled={!task.id}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="center">
                {editingTaskId === task.id ? (
                  <Box className="flex gap-1 justify-center">
                    <Tooltip title="Salvar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleSaveEdit(task.id!)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <IconButton
                        size="small"
                        color="default"
                        onClick={handleCancelEdit}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Tooltip title="Editar título">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(task)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {showViewModal && selectedTarefaId && (
      <TarefaViewModal
        tarefaId={selectedTarefaId}
        casoId={casoId}
        isOpen={showViewModal}
        onClose={handleCloseModal}
        onUpdate={handleTaskUpdate}
      />
    )}
    </>
  );
};
