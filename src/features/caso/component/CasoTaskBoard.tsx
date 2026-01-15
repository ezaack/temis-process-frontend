import React, { useState, useEffect } from 'react';
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
import { fireToast } from '../../../hooks/fireToast';
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
const TaskCard: React.FC<{ task: TarefaResource; isDragging?: boolean }> = ({
  task,
  isDragging = false,
}) => {
  const priorityColors = {
    BAIXA: 'bg-gray-100 text-gray-700',
    MEDIA: 'bg-blue-100 text-blue-700',
    ALTA: 'bg-orange-100 text-orange-700',
    URGENTE: 'bg-red-100 text-red-700',
  };

  return (
    <div
      className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow touch-pan-y sm:p-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{task.titulo}</h4>
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
const SortableTaskCard: React.FC<{ task: TarefaResource }> = ({ task }) => {
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
};

// Status Column Component
const StatusColumn: React.FC<{
  status: StatusTarefaResource;
  tasks: TarefaResource[];
  onAddTask: (statusId: string) => void;
}> = ({ status, tasks, onAddTask }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 min-w-[280px] flex flex-col sm:min-w-[300px] sm:p-4">
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
        <button
          onClick={() => onAddTask(status.id!)}
          className="text-gray-500 hover:text-gray-700 text-xl"
          title="Add Task"
        >
          +
        </button>
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
            <SortableTaskCard key={task.id} task={task} />
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      fireToast('error', 'Title is required');
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

// Main Board Component
export const CasoTaskBoard: React.FC<CasoTaskBoardProps> = ({ casoId }) => {
  const { user } = useUserContext();
  const [board, setBoard] = useState<QuadroTarefasResource | null>(null);
  const [tasks, setTasks] = useState<TarefaResource[]>([]);
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>({});
  const [loading, setLoading] = useState(true);  const [error, setError] = useState<string | null>(null);  const [activeTask, setActiveTask] = useState<TarefaResource | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskStatusId, setNewTaskStatusId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      fireToast('error', errorMessage);
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
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which status columns the active and over items belong to
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    let overStatusId = '';
    
    // Check if over a task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      overStatusId = overTask.statusId;
    } else {
      // Check if over a status column (for empty columns)
      overStatusId = overId;
    }

    const activeStatusId = activeTask.statusId;

    if (activeStatusId !== overStatusId) {
      // Moving between columns - update local state optimistically
      setTasksByStatus((prev) => {
        const activeItems = prev[activeStatusId] || [];
        const overItems = prev[overStatusId] || [];

        const activeIndex = activeItems.findIndex((t) => t.id === activeId);
        const overIndex = overTask
          ? overItems.findIndex((t) => t.id === overId)
          : overItems.length;

        const newActiveItems = activeItems.filter((t) => t.id !== activeId);
        const movedTask = { ...activeTask, statusId: overStatusId };
        const newOverItems = [...overItems];
        newOverItems.splice(overIndex, 0, movedTask);

        return {
          ...prev,
          [activeStatusId]: newActiveItems,
          [overStatusId]: newOverItems,
        };
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !user?.userData?.officeGroupId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    let overStatusId = '';
    const overTask = tasks.find((t) => t.id === overId);
    
    if (overTask) {
      overStatusId = overTask.statusId;
    } else {
      overStatusId = overId;
    }

    const activeStatusId = activeTask.statusId;

    try {
      if (activeStatusId === overStatusId) {
        // Reordering within the same column
        const items = tasksByStatus[activeStatusId] || [];
        const oldIndex = items.findIndex((t) => t.id === activeId);
        const newIndex = items.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex) {
          const reorderedItems = arrayMove(items, oldIndex, newIndex);
          
          setTasksByStatus((prev) => ({
            ...prev,
            [activeStatusId]: reorderedItems,
          }));

          // Update ordem on the server
          await tarefaService.reorderTarefa(
            user.userData.officeGroupId,
            activeId,
            newIndex
          );
        }
      } else {
        // Moving between columns
        const overItems = tasksByStatus[overStatusId] || [];
        const newIndex = overTask
          ? overItems.findIndex((t) => t.id === overId)
          : overItems.length;

        await tarefaService.moveTarefa(
          user.userData.officeGroupId,
          activeId,
          overStatusId,
          newIndex
        );

        // Refresh tasks to get updated data
        await loadBoardAndTasks();
      }

      fireToast('success', 'Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      fireToast('error', 'Failed to update task');
      // Reload to revert optimistic update
      await loadBoardAndTasks();
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
      const newTask: TarefaResource = {
        ...taskData,
        statusId,
        titulo: taskData.titulo!,
      };

      await tarefaService.createTarefa(
        user.userData.officeGroupId,
        statusId,
        newTask
      );

      fireToast('success', 'Task created successfully');
      await loadBoardAndTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      fireToast('error', 'Failed to create task');
      throw error;
    }
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
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {showNewTaskModal && (
        <NewTaskModal
          statusId={newTaskStatusId}
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};
