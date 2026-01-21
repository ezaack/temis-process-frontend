import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useUserContext } from '../../../context/UserContext';
import { quadroService } from '../api/quadroService';
import { tarefaService } from '../api/tarefaService';
import { useToast } from '../../../hooks/useToast';
import { TarefaViewModal } from './TarefaViewModal';
import type {
  QuadroTarefasResource,
  StatusTarefaResource,
  TarefaResource,
} from '../api/api-types';

interface CasoTaskBoardProps {
  casoId: string;
}

interface TasksByStatus {
  [statusId: string]: TarefaResource[];
}

// Task Card Component
const TaskCard: React.FC<{ 
  task: TarefaResource; 
  isDragging?: boolean; 
  dragListeners?: any;
  onClick?: (taskId: string) => void;
  isUpdating?: boolean;
}> = ({
  task,
  isDragging = false,
  dragListeners,
  onClick,
  isUpdating = false,
}) => {
  const priorityColors = {
    BAIXA: 'bg-gray-100 text-gray-700',
    MEDIA: 'bg-blue-100 text-blue-700',
    ALTA: 'bg-orange-100 text-orange-700',
    URGENTE: 'bg-red-100 text-red-700',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal when clicking interactive elements or dragging
    if (isDragging || !task.id) return;
    
    // Check if click was on an interactive element or drag handle
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select') || target.closest('input') || target.closest('.drag-handle')) {
      return;
    }
    
    onClick?.(task.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 touch-pan-y sm:p-4 relative ${
        isDragging ? 'opacity-50 rotate-2 scale-105 shadow-xl ring-2 ring-primary' : ''
      }`}
    >
      {isUpdating && (
        <div className="absolute inset-0 bg-white/80 dark:bg-boxdark/80 flex items-center justify-center rounded-lg z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </div>
      )}
      {dragListeners && (
        <div 
          {...dragListeners} 
          className="drag-handle absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </div>
      )}
      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base pr-8">{task.titulo}</h4>
      {task.descricao && (
        <p className="text-xs text-gray-600 mb-2 sm:text-sm">{task.descricao}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {task.prioridade && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              priorityColors[task.prioridade]
            }`}
          >
            {task.prioridade}
          </span>
        )}
        {task.prazo && (
          <span className="text-xs text-gray-500">
            📅 {new Date(task.prazo).toLocaleDateString()}
          </span>
        )}
        {task.estimativaHoras && (
          <span className="text-xs text-gray-500">⏱️ {task.estimativaHoras}h</span>
        )}
      </div>
    </div>
  );
};

// Sortable Task Card Component
const SortableTaskCard: React.FC<{ 
  task: TarefaResource; 
  onClick?: (taskId: string) => void;
  isUpdating?: boolean;
}> = ({ task, onClick, isUpdating }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard 
        task={task} 
        isDragging={isDragging} 
        dragListeners={listeners}
        onClick={onClick}
        isUpdating={isUpdating}
      />
    </div>
  );
};

// Status Column Component
const StatusColumn: React.FC<{
  status: StatusTarefaResource;
  tasks: TarefaResource[];
  onTaskClick?: (taskId: string) => void;
  updatingTaskIds?: Set<string>;
}> = ({ status, tasks, onTaskClick, updatingTaskIds }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status.id! });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-3 min-w-[280px] flex flex-col sm:min-w-[300px] sm:p-4 transition-all duration-200 ${
        isOver ? 'ring-2 ring-primary bg-primary/5 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {status.cor && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: status.cor }}
            />
          )}
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{status.nome}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {status.descricao && (
        <p className="text-sm text-gray-600 mb-3">{status.descricao}</p>
      )}

      <SortableContext
        items={tasks.map((t) => t.id!)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
          {tasks.map((task) => (
            <SortableTaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
              isUpdating={updatingTaskIds?.has(task.id!)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

// New Task Modal Component
const NewTaskModal: React.FC<{
  statusId: string;
  onClose: () => void;
  onSubmit: (statusId: string, task: Partial<TarefaResource>) => Promise<void>;
}> = ({ statusId, onClose, onSubmit }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<TarefaResource['prioridade']>('MEDIA');
  const [prazo, setPrazo] = useState('');
  const [estimativaHoras, setEstimativaHoras] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error('Erro', 'Title is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(statusId, {
        titulo,
        descricao: descricao || undefined,
        prioridade,
        prazo: prazo || undefined,
        estimativaHoras: estimativaHoras ? parseFloat(estimativaHoras) : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as TarefaResource['prioridade'])}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BAIXA">Low</option>
              <option value="MEDIA">Medium</option>
              <option value="ALTA">High</option>
              <option value="URGENTE">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={estimativaHoras}
              onChange={(e) => setEstimativaHoras(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Board Component Handle
export interface CasoTaskBoardHandle {
  openNewTaskModal: () => void;
}

// Main Board Component
export const CasoTaskBoard = forwardRef<CasoTaskBoardHandle, CasoTaskBoardProps>(({ casoId }, ref) => {
  const { user } = useUserContext();
  const toast = useToast();
  const [board, setBoard] = useState<QuadroTarefasResource | null>(null);
  const [tasks, setTasks] = useState<TarefaResource[]>([]);
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>({});
  const [loading, setLoading] = useState(true);  const [error, setError] = useState<string | null>(null);  const [activeTask, setActiveTask] = useState<TarefaResource | null>(null);
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(new Set());
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskStatusId, setNewTaskStatusId] = useState<string>('');
  const [selectedTarefaId, setSelectedTarefaId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Expose method to open new task modal for first status (A fazer)
  useImperativeHandle(ref, () => ({
    openNewTaskModal: () => {
      if (!board?.statusTarefas || board.statusTarefas.length === 0) {
        toast.error('Erro', 'Nenhum status disponível para criar tarefa');
        return;
      }
      // Find first status by ordem (should be "A fazer")
      const firstStatus = [...board.statusTarefas].sort((a, b) => a.ordem - b.ordem)[0];
      handleAddTask(firstStatus.id!);
    },
  }));

  useEffect(() => {
    loadBoardAndTasks();
  }, [casoId]);

  const loadBoardAndTasks = async () => {
    if (!user?.userData?.officeGroupId) return;

    setLoading(true);
    try {
      setError(null);
      const [boardData, tasksData] = await Promise.all([
        quadroService.getQuadroTarefasByCaso(user.userData.officeGroupId, casoId),
        tarefaService.getTarefasByCaso(user.userData.officeGroupId, casoId),
      ]);

      setBoard(boardData);
      setTasks(tasksData);
      groupTasksByStatus(tasksData);
    } catch (error: any) {
      console.error('Error loading board and tasks:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao carregar quadro de tarefas';
      setError(errorMessage);
      toast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const groupTasksByStatus = (allTasks: TarefaResource[]) => {
    const grouped: TasksByStatus = {};
    allTasks.forEach((task) => {
      if (!grouped[task.statusId]) {
        grouped[task.statusId] = [];
      }
      grouped[task.statusId].push(task);
    });

    // Sort tasks by ordem within each status
    Object.keys(grouped).forEach((statusId) => {
      grouped[statusId].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    });

    setTasksByStatus(grouped);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Visual feedback only - actual state update happens in handleDragEnd
    // This prevents duplicate key issues during drag operations
    return;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !user?.userData?.officeGroupId) {
      console.log('[DragEnd] Early return - over:', !!over, 'groupId:', !!user?.userData?.officeGroupId);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('[DragEnd] activeId:', activeId, 'overId:', overId);

    if (activeId === overId) {
      console.log('[DragEnd] Same item, no move needed');
      return;
    }

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) {
      console.log('[DragEnd] Active task not found:', activeId);
      return;
    }

    let overStatusId = '';
    const overTask = tasks.find((t) => t.id === overId);
    
    if (overTask) {
      overStatusId = overTask.statusId;
    } else {
      overStatusId = overId;
    }

    const activeStatusId = activeTask.statusId;

    console.log('[DragEnd] Move details:', {
      taskId: activeId,
      fromStatus: activeStatusId,
      toStatus: overStatusId,
      sameColumn: activeStatusId === overStatusId
    });

    // Set loading state for this task
    setUpdatingTaskIds(prev => new Set(prev).add(activeId));

    try {
      if (activeStatusId === overStatusId) {
        // Reordering within the same column
        console.log('[DragEnd] Reordering within same column');
        const items = tasksByStatus[activeStatusId] || [];
        const oldIndex = items.findIndex((t) => t.id === activeId);
        const newIndex = items.findIndex((t) => t.id === overId);

        console.log('[DragEnd] Reorder indices - old:', oldIndex, 'new:', newIndex);

        if (oldIndex !== newIndex) {
          const reorderedItems = arrayMove(items, oldIndex, newIndex);
          
          setTasksByStatus((prev) => ({
            ...prev,
            [activeStatusId]: reorderedItems,
          }));

          // Update ordem on the server
          console.log('[DragEnd] Calling reorderTarefa API:', { activeId, newIndex });
          const result = await tarefaService.reorderTarefa(
            user.userData.officeGroupId,
            activeId,
            newIndex
          );
          console.log('[DragEnd] reorderTarefa response:', result);
          
          // Reload to ensure consistency with server
          console.log('[DragEnd] Reloading board after reorder');
          await loadBoardAndTasks();
        } else {
          console.log('[DragEnd] No reorder needed, indices are the same');
        }
      } else {
        // Moving between columns
        console.log('[DragEnd] Moving between columns');
        const overItems = tasksByStatus[overStatusId] || [];
        const newIndex = overTask
          ? overItems.findIndex((t) => t.id === overId)
          : overItems.length;

        console.log('[DragEnd] Calling moveTarefa API:', { activeId, overStatusId, newIndex });
        const result = await tarefaService.moveTarefa(
          user.userData.officeGroupId,
          activeId,
          overStatusId,
          newIndex
        );
        console.log('[DragEnd] moveTarefa response:', result);

        // Refresh tasks to get updated data
        console.log('[DragEnd] Reloading board and tasks');
        await loadBoardAndTasks();
      }

      console.log('[DragEnd] Update successful');
      toast.success('Sucesso', 'Tarefa atualizada');
    } catch (error: any) {
      console.error('[DragEnd] Error updating task:', error);
      console.error('[DragEnd] Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Falha ao atualizar tarefa';
      toast.error('Erro', message);
      // Reload to revert optimistic update
      console.log('[DragEnd] Reloading after error');
      await loadBoardAndTasks();
    } finally {
      setUpdatingTaskIds(prev => {
        const next = new Set(prev);
        next.delete(activeId);
        return next;
      });
      console.log('[DragEnd] Complete');
    }
  };

  const handleAddTask = (statusId: string) => {
    setNewTaskStatusId(statusId);
    setShowNewTaskModal(true);
  };

  const handleCreateTask = async (
    statusId: string,
    taskData: Partial<TarefaResource>
  ) => {
    if (!user?.userData?.officeGroupId) return;

    try {
      // Include statusId in the body as per API spec
      const newTask: TarefaResource = {
        ...taskData,
        statusId,
        titulo: taskData.titulo!,
      };

      await tarefaService.createTarefa(
        user.userData.officeGroupId,
        casoId,
        newTask
      );

      toast.success('Sucesso', 'Task created successfully');
      await loadBoardAndTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Erro', 'Failed to create task');
      throw error;
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTarefaId(taskId);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedTarefaId(null);
  };

  const handleTaskUpdate = async () => {
    // Refresh board after task update/delete
    await loadBoardAndTasks();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto mb-4"></div>
          <div className="text-gray-600">Carregando quadro de tarefas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => loadBoardAndTasks()}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!board || !board.statusTarefas || board.statusTarefas.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-600 font-semibold mb-2">Nenhum quadro de tarefas encontrado</p>
          <p className="text-sm text-gray-500 mb-4">
            Um quadro de tarefas deve ser criado automaticamente com o caso.
          </p>
          <button
            onClick={() => loadBoardAndTasks()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            🔄 Recarregar
          </button>
        </div>
      </div>
    );
  }

  const sortedStatuses = [...board.statusTarefas].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 sm:gap-4 sm:-mx-0 sm:px-0">
          {sortedStatuses.map((status) => (
            <StatusColumn
              key={status.id}
              status={status}
              tasks={tasksByStatus[status.id!] || []}
              onTaskClick={handleTaskClick}
              updatingTaskIds={updatingTaskIds}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 5h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zm0-2h12v1H2V3z"/>
        </svg>
        <span>Dica: Arraste tarefas entre colunas ou use Tab + Espaço para mover pelo teclado</span>
      </div>

      {showNewTaskModal && (
        <NewTaskModal
          statusId={newTaskStatusId}
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={handleCreateTask}
        />
      )}

      {showViewModal && selectedTarefaId && (
        <TarefaViewModal
          tarefaId={selectedTarefaId}
          casoId={casoId}
          isOpen={showViewModal}
          onClose={handleCloseViewModal}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
});

CasoTaskBoard.displayName = 'CasoTaskBoard';
