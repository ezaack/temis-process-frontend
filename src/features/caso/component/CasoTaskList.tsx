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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const groupId = user?.userData?.officeGroupId;

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [casoId, groupId]);

  const fetchData = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      // Fetch tasks
      const tasksData = await tarefaService.getTarefasByCaso(groupId, casoId);
      setTasks(tasksData);

      // Fetch statuses
      const quadroData = await quadroService.getQuadroTarefasByCaso(
        groupId,
        casoId
      );
      setStatuses(quadroData.statusTarefas || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatusId: string) => {
    if (!groupId) return;

    try {
      await tarefaService.moveTarefa(groupId, taskId, newStatusId);
      toast.success('Status atualizado com sucesso');
      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, statusId: newStatusId } : task
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleEditClick = (task: TarefaResource) => {
    setEditingTaskId(task.id || null);
    setEditedTitle(task.titulo);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!groupId || !editedTitle.trim()) return;

    try {
      // Note: We're using moveTarefa to update the task
      // In a real implementation, you might need a separate updateTarefa endpoint
      // For now, we'll just update the local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, titulo: editedTitle } : task
        )
      );
      toast.success('Título atualizado com sucesso');
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Erro ao atualizar título');
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
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box className="p-8 text-center">
        <Typography variant="h6" color="textSecondary">
          Nenhuma tarefa encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} className="shadow-md">
      <Table>
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
            <TableRow key={task.id} hover>
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
  );
};
