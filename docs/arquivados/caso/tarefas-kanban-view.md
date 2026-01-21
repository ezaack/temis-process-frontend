# Tarefas: Kanban View Design

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 5 of 8

---

## Overview

This document defines the detailed design specification for the **Kanban Board View** of Tarefas (tasks) in the "Visualizar Caso" screen. The Kanban view provides a visual, column-based representation of task workflow, enabling quick status updates through drag-and-drop interactions.

---

## 1. Kanban Board Structure

### 1.1 Column Definition

The Kanban board consists of **4 primary columns** representing the task lifecycle:

| Column | Status Value | Description | Color Theme | Icon |
|--------|--------------|-------------|-------------|------|
| **A Fazer** | `a_fazer` | Tasks not yet started | Blue | 📋 |
| **Em Progresso** | `em_progresso` | Tasks currently being worked on | Yellow | ⚙️ |
| **Em Revisão** | `em_revisao` | Tasks completed but awaiting review | Purple | 👁️ |
| **Concluído** | `concluido` | Tasks fully completed | Green | ✓ |

### 1.2 Column Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TAREFAS - CASO: [Case Title]                                               │
│  [+ Nova Tarefa]         [Filtros ▼]         [🎯 Board] [📋 List]          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐                 │
│  │ 📋 A Fazer  │ ⚙️ Em Progr │ 👁️ Em Revis │ ✓ Concluído │                 │
│  │ (5 tarefas) │ (3 tarefas) │ (2 tarefas) │ (12 tarefas)│                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │             │             │             │             │                 │
│  │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │                 │
│  │ │ Task 1  │ │ │ Task 4  │ │ │ Task 7  │ │ │ Task 10 │ │                 │
│  │ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘ │                 │
│  │             │             │             │             │                 │
│  │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ [collapsed] │                 │
│  │ │ Task 2  │ │ │ Task 5  │ │ │ Task 8  │ │ Show more   │                 │
│  │ └─────────┘ │ └─────────┘ │ └─────────┘ │             │                 │
│  │             │             │             │             │                 │
│  │ ┌─────────┐ │ ┌─────────┐ │             │             │                 │
│  │ │ Task 3  │ │ │ Task 6  │ │             │             │                 │
│  │ └─────────┘ │ └─────────┘ │             │             │                 │
│  │             │             │             │             │                 │
│  │ ┌─────────┐ │             │             │             │                 │
│  │ │ Task 9  │ │             │             │             │                 │
│  │ └─────────┘ │             │             │             │                 │
│  │             │             │             │             │                 │
│  │ ┌─────────┐ │             │             │             │                 │
│  │ │ Task 11 │ │             │             │             │                 │
│  │ └─────────┘ │             │             │             │                 │
│  │             │             │             │             │                 │
│  └─────────────┴─────────────┴─────────────┴─────────────┘                 │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Column Behavior

#### Default Display
- **Show First 10 Tasks**: Display first 10 tasks per column by default
- **Collapsed View**: If > 10 tasks, show "Show more (X)" button at bottom
- **Expand on Click**: Clicking "Show more" reveals all tasks

#### Empty State per Column
```tsx
function EmptyColumnState({ columnName }: { columnName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-bodydark2">
      <div className="text-4xl mb-2">📭</div>
      <p className="text-sm">Nenhuma tarefa em "{columnName}"</p>
      <p className="text-xs mt-1">Arraste tarefas para cá ou crie uma nova</p>
    </div>
  );
}
```

---

## 2. Task Card Design

### 2.1 Card Structure

Each task card displays essential information for quick decision-making:

```
┌─────────────────────────────────────────────────────────┐
│ [!] URGENTE                            [···] Menu       │ ← Priority Badge + Actions
├─────────────────────────────────────────────────────────┤
│ Analisar documentos do cliente                          │ ← Title (truncated at 2 lines)
├─────────────────────────────────────────────────────────┤
│ #T-12345 • Tipo: Análise                               │ ← ID + Tipo
├─────────────────────────────────────────────────────────┤
│ 👤 João Silva                                           │ ← Responsável
│ 👥 Criado por: Maria Santos                            │ ← Criador
├─────────────────────────────────────────────────────────┤
│ ⏰ Vence em 2 dias (17/01/2026)                        │ ← Prazo (with urgency)
│ ⏱️ Estimativa: 4h                                      │ ← Estimativa horas
├─────────────────────────────────────────────────────────┤
│ 📎 3 arquivos • 💬 5 comentários                       │ ← Metadata counts
└─────────────────────────────────────────────────────────┘
```

### 2.2 Card Visual Hierarchy

**Priority Levels** (color-coded left border):
- 🔴 **Urgente** - Red border (`border-l-4 border-l-danger`)
- 🟡 **Alta** - Orange border (`border-l-4 border-l-warning`)
- 🟢 **Normal** - Blue border (`border-l-4 border-l-primary`)
- ⚪ **Baixa** - Gray border (`border-l-4 border-l-bodydark2`)

### 2.3 Card Metadata Specification

| Field | Priority | Display Rules | Format |
|-------|----------|---------------|--------|
| **Title** | Critical | Always visible, truncate at 2 lines with ellipsis | String |
| **ID** | High | Always visible | `#T-{shortId}` |
| **Priority Badge** | Critical | Always visible, top-right corner | Badge with icon + text |
| **Responsável** | Critical | Always visible with avatar | Avatar + Name |
| **Criador** | Medium | Always visible | "Criado por: {name}" |
| **Tipo** | Medium | Always visible | Badge |
| **Prazo** | High | Show if exists, color-code urgency | Date + relative time |
| **Estimativa Horas** | Low | Show if exists | Hours format |
| **Descrição** | Low | Hidden, show in detail view | - |
| **Arquivos Count** | Medium | Show if > 0 | Icon + count |
| **Comentários Count** | Medium | Show if > 0 | Icon + count |
| **Tags/Labels** | Low | Future enhancement | Badge list |

### 2.4 Card Component Structure

```typescript
interface TarefaCardProps {
  tarefa: Tarefa;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (tarefaId: string) => void;
  onView: (tarefaId: string) => void;
  isDragging?: boolean;
}

interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'a_fazer' | 'em_progresso' | 'em_revisao' | 'concluido';
  prioridade: 'urgente' | 'alta' | 'normal' | 'baixa';
  tipo?: string;
  responsavelId?: string;
  responsavelNome?: string;
  responsavelAvatar?: string;
  criadorId: string;
  criadorNome: string;
  prazo?: string; // ISO datetime
  estimativaHoras?: number;
  criadoEm: string;
  atualizadoEm: string;
  quadroTarefasId: string;
  casoId?: string;
  // Metadata counts (computed)
  arquivosCount?: number;
  comentariosCount?: number;
}
```

### 2.5 Card Implementation

```tsx
function TarefaCard({ tarefa, onEdit, onDelete, onView, isDragging }: TarefaCardProps) {
  const prazoInfo = calculatePrazoUrgency(tarefa.prazo);
  const prioridadeConfig = getPrioridadeConfig(tarefa.prioridade);
  
  return (
    <div
      className={`
        group relative rounded-lg border bg-white p-4 shadow-sm
        transition-all duration-200 hover:shadow-md
        ${prioridadeConfig.borderClass}
        ${isDragging ? 'opacity-50 scale-95' : 'cursor-grab active:cursor-grabbing'}
        dark:bg-boxdark dark:border-strokedark
      `}
      draggable
    >
      {/* Header: Priority Badge + Actions Menu */}
      <div className="flex items-start justify-between mb-3">
        <PriorityBadge prioridade={tarefa.prioridade} />
        <DropdownMenu>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-bodydark">···</span>
          </button>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={() => onView(tarefa.id)}>
              👁️ Ver detalhes
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => onEdit(tarefa)}>
              ✏️ Editar
            </DropdownMenu.Item>
            <DropdownMenu.Divider />
            <DropdownMenu.Item onClick={() => onDelete(tarefa.id)} variant="danger">
              🗑️ Excluir
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 
        className="mb-2 font-medium text-black dark:text-white line-clamp-2 cursor-pointer hover:text-primary"
        onClick={() => onView(tarefa.id)}
      >
        {tarefa.titulo}
      </h4>

      {/* ID + Tipo */}
      <div className="flex items-center gap-2 mb-2 text-xs text-bodydark">
        <span className="font-mono">#{tarefa.id.slice(0, 8)}</span>
        {tarefa.tipo && (
          <>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-bodydark2/10">{tarefa.tipo}</span>
          </>
        )}
      </div>

      {/* Responsável */}
      {tarefa.responsavelNome && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
            {tarefa.responsavelAvatar ? (
              <img src={tarefa.responsavelAvatar} alt="" className="w-full h-full rounded-full" />
            ) : (
              tarefa.responsavelNome.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-sm text-black dark:text-white">{tarefa.responsavelNome}</span>
        </div>
      )}

      {/* Criador */}
      <div className="text-xs text-bodydark mb-2">
        Criado por: {tarefa.criadorNome}
      </div>

      {/* Prazo */}
      {tarefa.prazo && (
        <div className={`flex items-center gap-1 text-xs mb-2 ${prazoInfo.textColor}`}>
          <span>⏰</span>
          <span>{prazoInfo.label}</span>
        </div>
      )}

      {/* Estimativa Horas */}
      {tarefa.estimativaHoras && (
        <div className="flex items-center gap-1 text-xs text-bodydark mb-2">
          <span>⏱️</span>
          <span>Estimativa: {tarefa.estimativaHoras}h</span>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stroke dark:border-strokedark text-xs text-bodydark">
        {tarefa.arquivosCount > 0 && (
          <span className="flex items-center gap-1">
            📎 {tarefa.arquivosCount}
          </span>
        )}
        {tarefa.comentariosCount > 0 && (
          <span className="flex items-center gap-1">
            💬 {tarefa.comentariosCount}
          </span>
        )}
      </div>
    </div>
  );
}
```

### 2.6 Priority Configuration

```typescript
interface PrioridadeConfig {
  label: string;
  color: string;
  borderClass: string;
  badgeClass: string;
  icon: string;
}

const prioridadeConfig: Record<Tarefa['prioridade'], PrioridadeConfig> = {
  urgente: {
    label: 'URGENTE',
    color: 'danger',
    borderClass: 'border-l-4 border-l-danger',
    badgeClass: 'bg-danger text-white',
    icon: '🔴'
  },
  alta: {
    label: 'ALTA',
    color: 'warning',
    borderClass: 'border-l-4 border-l-warning',
    badgeClass: 'bg-warning text-white',
    icon: '🟡'
  },
  normal: {
    label: 'NORMAL',
    color: 'primary',
    borderClass: 'border-l-4 border-l-primary',
    badgeClass: 'bg-primary text-white',
    icon: '🟢'
  },
  baixa: {
    label: 'BAIXA',
    color: 'bodydark2',
    borderClass: 'border-l-4 border-l-bodydark2',
    badgeClass: 'bg-bodydark2/20 text-bodydark',
    icon: '⚪'
  }
};

function getPrioridadeConfig(prioridade: Tarefa['prioridade']): PrioridadeConfig {
  return prioridadeConfig[prioridade] || prioridadeConfig.normal;
}
```

### 2.7 Prazo Urgency Calculation

```typescript
interface PrazoUrgency {
  level: 'overdue' | 'urgent' | 'soon' | 'normal';
  label: string;
  textColor: string;
  daysUntil: number;
}

function calculatePrazoUrgency(prazo?: string): PrazoUrgency {
  if (!prazo) {
    return { level: 'normal', label: '', textColor: '', daysUntil: 0 };
  }

  const now = new Date();
  const prazoDate = new Date(prazo);
  const diffMs = prazoDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Overdue
  if (diffDays < 0) {
    return {
      level: 'overdue',
      label: `Vencido há ${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? 's' : ''}`,
      textColor: 'text-danger font-semibold',
      daysUntil: diffDays
    };
  }

  // Today
  if (diffDays === 0) {
    return {
      level: 'urgent',
      label: `Vence hoje às ${prazoDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      textColor: 'text-danger font-semibold',
      daysUntil: 0
    };
  }

  // Urgent (1-2 days)
  if (diffDays <= 2) {
    return {
      level: 'urgent',
      label: `Vence em ${diffDays} dia${diffDays !== 1 ? 's' : ''} (${prazoDate.toLocaleDateString('pt-BR')})`,
      textColor: 'text-warning font-medium',
      daysUntil: diffDays
    };
  }

  // Soon (3-7 days)
  if (diffDays <= 7) {
    return {
      level: 'soon',
      label: `Vence em ${diffDays} dias (${prazoDate.toLocaleDateString('pt-BR')})`,
      textColor: 'text-warning',
      daysUntil: diffDays
    };
  }

  // Normal (> 7 days)
  return {
    level: 'normal',
    label: `Vence em ${prazoDate.toLocaleDateString('pt-BR')}`,
    textColor: 'text-bodydark',
    daysUntil: diffDays
  };
}
```

---

## 3. Drag-and-Drop Behavior

### 3.1 Interaction Model

The Kanban board uses **drag-and-drop** for moving tasks between columns:

```
User Action                    → System Response
────────────────────────────────────────────────────────────
1. User hovers over card       → Show drag cursor
2. User clicks and drags       → Card becomes semi-transparent
                                 Show drop zones highlighted
3. User drags over column      → Column highlights (blue border)
                                 Show insertion indicator
4. User releases               → Card animates to new position
                                 Update status in backend
                                 Show success toast
5. Backend confirms            → Remove loading indicator
6. Backend error               → Revert card to original position
                                 Show error toast with retry
```

### 3.2 Drag-and-Drop States

```typescript
interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  draggedFromColumn: string | null;
  hoverOverColumn: string | null;
  dropPosition: number | null;
}

interface DropResult {
  sourceColumn: string;
  destinationColumn: string;
  taskId: string;
  newStatus: Tarefa['status'];
  newPosition: number;
}
```

### 3.3 Implementation Strategy

**Library**: Use `@dnd-kit/core` for drag-and-drop functionality

```typescript
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

function KanbanBoard({ casoId }: { casoId: string }) {
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [activeTask, setActiveTask] = useState<Tarefa | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as Tarefa['status'];
    const task = tasks.find(t => t.id === taskId);

    if (!task || task.status === newStatus) {
      setActiveTask(null);
      return;
    }

    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    setActiveTask(null);

    try {
      // Update backend
      await updateTarefaStatus(taskId, newStatus);
      
      // Show success toast
      toast.success('Status da tarefa atualizado');
    } catch (error) {
      // Revert on error
      setTasks(tasks);
      toast.error('Erro ao atualizar status. Tente novamente.');
    }
  };

  const tasksByStatus = groupBy(tasks, 'status');

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-6">
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.status}
            column={column}
            tasks={tasksByStatus[column.status] || []}
          />
        ))}
      </div>
      
      {/* Drag overlay - shows dragging card */}
      <DragOverlay>
        {activeTask && <TarefaCard tarefa={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
```

### 3.4 Column Drop Zone

```tsx
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Tarefa[];
}

function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col rounded-lg border-2 bg-white p-4 transition-colors
        dark:bg-boxdark
        ${isOver ? 'border-primary border-dashed bg-primary/5' : 'border-stroke dark:border-strokedark'}
      `}
    >
      {/* Column header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{column.icon}</span>
          <h3 className="font-semibold text-black dark:text-white">{column.label}</h3>
        </div>
        <span className="text-sm text-bodydark">({tasks.length})</span>
      </div>

      {/* Task list */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <EmptyColumnState columnName={column.label} />
        ) : (
          tasks.map(task => (
            <DraggableTask key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
```

### 3.5 Draggable Task

```tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function DraggableTask({ task }: { task: Tarefa }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TarefaCard tarefa={task} isDragging={isDragging} />
    </div>
  );
}
```

### 3.6 Drag Constraints

**Allowed Transitions**: All status changes are allowed

| From | To | Allowed |
|------|-----|---------|
| A Fazer | Em Progresso | ✅ |
| A Fazer | Em Revisão | ✅ (skip step) |
| A Fazer | Concluído | ✅ (skip steps) |
| Em Progresso | A Fazer | ✅ (move back) |
| Em Progresso | Em Revisão | ✅ |
| Em Progresso | Concluído | ✅ (skip step) |
| Em Revisão | A Fazer | ✅ (move back) |
| Em Revisão | Em Progresso | ✅ (move back) |
| Em Revisão | Concluído | ✅ |
| Concluído | Any | ✅ (reopen) |

**Note**: While all transitions are technically allowed, consider adding confirmation dialogs for:
- Moving from "Concluído" back to any other status (reopening)
- Skipping "Em Revisão" when going directly to "Concluído"

### 3.7 Keyboard Accessibility

Support keyboard navigation for drag-and-drop:

- `Tab` - Navigate between cards
- `Space` / `Enter` - Pick up / Drop card
- `Arrow Keys` - Move card between columns when picked up
- `Escape` - Cancel drag operation

```typescript
// Keyboard handling
function handleKeyDown(event: React.KeyboardEvent, task: Tarefa) {
  if (event.key === 'Enter' || event.key === ' ') {
    // Start drag
    event.preventDefault();
    startKeyboardDrag(task);
  } else if (event.key === 'Escape') {
    // Cancel drag
    cancelKeyboardDrag();
  } else if (event.key.startsWith('Arrow')) {
    // Move between columns
    event.preventDefault();
    moveTaskWithKeyboard(task, event.key);
  }
}
```

---

## 4. Column Configuration

### 4.1 Column Metadata

```typescript
interface ColumnConfig {
  status: Tarefa['status'];
  label: string;
  icon: string;
  color: string;
  description: string;
  order: number;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'a_fazer',
    label: 'A Fazer',
    icon: '📋',
    color: 'blue',
    description: 'Tarefas que ainda não foram iniciadas',
    order: 1
  },
  {
    status: 'em_progresso',
    label: 'Em Progresso',
    icon: '⚙️',
    color: 'yellow',
    description: 'Tarefas sendo trabalhadas no momento',
    order: 2
  },
  {
    status: 'em_revisao',
    label: 'Em Revisão',
    icon: '👁️',
    color: 'purple',
    description: 'Tarefas aguardando revisão',
    order: 3
  },
  {
    status: 'concluido',
    label: 'Concluído',
    icon: '✓',
    color: 'green',
    description: 'Tarefas finalizadas',
    order: 4
  }
];
```

### 4.2 Column Sorting

Tasks within each column are sorted by:

1. **Priority** (Urgente → Alta → Normal → Baixa)
2. **Prazo** (Earliest first, null last)
3. **Updated At** (Most recent first)

```typescript
function sortTasksInColumn(tasks: Tarefa[]): Tarefa[] {
  const priorityOrder = { urgente: 1, alta: 2, normal: 3, baixa: 4 };
  
  return [...tasks].sort((a, b) => {
    // 1. Sort by priority
    const prioA = priorityOrder[a.prioridade];
    const prioB = priorityOrder[b.prioridade];
    if (prioA !== prioB) return prioA - prioB;

    // 2. Sort by prazo (deadline)
    if (a.prazo && b.prazo) {
      return new Date(a.prazo).getTime() - new Date(b.prazo).getTime();
    }
    if (a.prazo) return -1; // Tasks with deadline come first
    if (b.prazo) return 1;

    // 3. Sort by updated date
    return new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime();
  });
}
```

---

## 5. Filtering & Search

### 5.1 Filter Bar

```tsx
interface TaskFilters {
  search?: string;
  prioridade?: Tarefa['prioridade'][];
  responsavelId?: string[];
  tipo?: string[];
  prazoRange?: { start: string; end: string };
  hasDeadline?: boolean;
}

function KanbanFilterBar({ filters, onFiltersChange }: {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      {/* Search */}
      <input
        type="text"
        placeholder="Buscar tarefas..."
        value={filters.search || ''}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        className="w-64 rounded border border-stroke px-3 py-2 text-sm"
      />

      {/* Priority Filter */}
      <MultiSelect
        label="Prioridade"
        options={[
          { value: 'urgente', label: '🔴 Urgente' },
          { value: 'alta', label: '🟡 Alta' },
          { value: 'normal', label: '🟢 Normal' },
          { value: 'baixa', label: '⚪ Baixa' }
        ]}
        value={filters.prioridade || []}
        onChange={(value) => onFiltersChange({ ...filters, prioridade: value })}
      />

      {/* Responsável Filter */}
      <MultiSelect
        label="Responsável"
        options={[/* Load from employees */]}
        value={filters.responsavelId || []}
        onChange={(value) => onFiltersChange({ ...filters, responsavelId: value })}
      />

      {/* Quick Filters */}
      <button
        onClick={() => onFiltersChange({ ...filters, hasDeadline: true })}
        className={`btn-sm ${filters.hasDeadline ? 'btn-primary' : 'btn-secondary'}`}
      >
        ⏰ Com prazo
      </button>

      {/* Clear Filters */}
      {Object.keys(filters).length > 0 && (
        <button
          onClick={() => onFiltersChange({})}
          className="btn-sm btn-ghost text-danger"
        >
          ✕ Limpar filtros
        </button>
      )}
    </div>
  );
}
```

### 5.2 Filter Logic

```typescript
function filterTasks(tasks: Tarefa[], filters: TaskFilters): Tarefa[] {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.titulo.toLowerCase().includes(searchLower);
      const matchesDescription = task.descricao?.toLowerCase().includes(searchLower);
      const matchesId = task.id.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription && !matchesId) return false;
    }

    // Priority filter
    if (filters.prioridade && filters.prioridade.length > 0) {
      if (!filters.prioridade.includes(task.prioridade)) return false;
    }

    // Responsável filter
    if (filters.responsavelId && filters.responsavelId.length > 0) {
      if (!task.responsavelId || !filters.responsavelId.includes(task.responsavelId)) {
        return false;
      }
    }

    // Tipo filter
    if (filters.tipo && filters.tipo.length > 0) {
      if (!task.tipo || !filters.tipo.includes(task.tipo)) return false;
    }

    // Has deadline filter
    if (filters.hasDeadline) {
      if (!task.prazo) return false;
    }

    // Prazo range filter
    if (filters.prazoRange) {
      if (!task.prazo) return false;
      const prazoDate = new Date(task.prazo);
      const start = new Date(filters.prazoRange.start);
      const end = new Date(filters.prazoRange.end);
      if (prazoDate < start || prazoDate > end) return false;
    }

    return true;
  });
}
```

---

## 6. Task Actions

### 6.1 Quick Actions Menu

Each task card has a dropdown menu (···) with:

```typescript
const taskActions = [
  {
    id: 'view',
    label: 'Ver detalhes',
    icon: '👁️',
    action: (task: Tarefa) => navigateToTaskDetail(task.id)
  },
  {
    id: 'edit',
    label: 'Editar',
    icon: '✏️',
    action: (task: Tarefa) => openEditModal(task)
  },
  {
    id: 'duplicate',
    label: 'Duplicar',
    icon: '📋',
    action: (task: Tarefa) => duplicateTask(task)
  },
  { type: 'divider' },
  {
    id: 'move_to',
    label: 'Mover para',
    icon: '↔️',
    submenu: [
      { label: 'A Fazer', action: (task) => moveTask(task, 'a_fazer') },
      { label: 'Em Progresso', action: (task) => moveTask(task, 'em_progresso') },
      { label: 'Em Revisão', action: (task) => moveTask(task, 'em_revisao') },
      { label: 'Concluído', action: (task) => moveTask(task, 'concluido') }
    ]
  },
  {
    id: 'assign',
    label: 'Atribuir a',
    icon: '👤',
    submenu: [/* Load employees */]
  },
  { type: 'divider' },
  {
    id: 'archive',
    label: 'Arquivar',
    icon: '📦',
    action: (task: Tarefa) => archiveTask(task.id),
    variant: 'warning'
  },
  {
    id: 'delete',
    label: 'Excluir',
    icon: '🗑️',
    action: (task: Tarefa) => deleteTask(task.id),
    variant: 'danger'
  }
];
```

### 6.2 Inline Actions

**Click Title** → Navigate to task detail page

**Click Responsável Avatar** → Filter by that person

**Click Prazo** → Open prazo editor

### 6.3 Bulk Actions

Allow selecting multiple tasks for bulk operations:

```tsx
function KanbanBoard() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectionMode(!selectionMode)}>
            {selectionMode ? '✓ Modo Seleção' : 'Selecionar múltiplas'}
          </button>
          
          {selectionMode && selectedTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-bodydark">
                {selectedTasks.length} selecionada(s)
              </span>
              <button onClick={() => bulkMoveTask(selectedTasks, newStatus)}>
                Mover para
              </button>
              <button onClick={() => bulkAssign(selectedTasks, employeeId)}>
                Atribuir a
              </button>
              <button onClick={() => bulkDelete(selectedTasks)} className="text-danger">
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Board with selection checkboxes */}
    </>
  );
}
```

---

## 7. Performance Optimizations

### 7.1 Virtual Scrolling

For columns with > 50 tasks, implement virtual scrolling:

```typescript
import { FixedSizeList } from 'react-window';

function VirtualizedTaskList({ tasks }: { tasks: Tarefa[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={tasks.length}
      itemSize={180} // Approximate card height
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <TarefaCard tarefa={tasks[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 7.2 Memoization

```typescript
// Memoize sorted/filtered tasks
const sortedTasks = useMemo(
  () => sortTasksInColumn(filteredTasks),
  [filteredTasks]
);

// Memoize task cards
const MemoizedTarefaCard = React.memo(TarefaCard, (prev, next) => {
  return (
    prev.tarefa.id === next.tarefa.id &&
    prev.tarefa.status === next.tarefa.status &&
    prev.tarefa.atualizadoEm === next.tarefa.atualizadoEm &&
    prev.isDragging === next.isDragging
  );
});
```

### 7.3 Lazy Loading

Load completed tasks on demand:

```typescript
function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? tasks : tasks.slice(0, 10);

  return (
    <div>
      {/* ... */}
      {tasks.length > 10 && !showAll && (
        <button onClick={() => setShowAll(true)} className="btn-sm btn-ghost w-full">
          Mostrar mais {tasks.length - 10} tarefas
        </button>
      )}
    </div>
  );
}
```

---

## 8. Responsive Design

### Desktop (> 1024px)
```css
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
```

### Tablet (640px - 1024px)
```css
.kanban-board {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2x2 grid */
  gap: 1rem;
}
```

### Mobile (< 640px)
```css
.kanban-board {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Horizontal scroll for columns */
.kanban-board-mobile {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-snap-type: x mandatory;
}

.kanban-column {
  min-width: 85vw;
  scroll-snap-align: start;
}
```

---

## 9. Loading & Error States

### 9.1 Loading State

```tsx
function KanbanBoardSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(col => (
        <div key={col} className="rounded-lg border border-stroke bg-white p-4">
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-bodydark2/20" />
          {[1, 2, 3].map(card => (
            <div key={card} className="mb-3 h-40 animate-pulse rounded bg-bodydark2/10" />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 9.2 Error State

```tsx
function KanbanBoardError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
        Erro ao carregar tarefas
      </h3>
      <p className="text-bodydark mb-4">{error.message}</p>
      <button onClick={onRetry} className="btn btn-primary">
        Tentar novamente
      </button>
    </div>
  );
}
```

---

## 10. Accessibility

### ARIA Labels

```tsx
<div
  role="region"
  aria-label={`Coluna ${column.label} com ${tasks.length} tarefas`}
  className="kanban-column"
>
  {/* Column content */}
</div>

<div
  role="article"
  aria-label={`Tarefa: ${task.titulo}, Prioridade: ${task.prioridade}, Status: ${task.status}`}
  tabIndex={0}
  className="task-card"
>
  {/* Task card content */}
</div>
```

### Screen Reader Announcements

```typescript
function announceTaskMove(task: Tarefa, oldStatus: string, newStatus: string) {
  const message = `Tarefa "${task.titulo}" movida de ${oldStatus} para ${newStatus}`;
  
  // Create live region announcement
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  announcement.className = 'sr-only';
  document.body.appendChild(announcement);
  
  setTimeout(() => document.body.removeChild(announcement), 1000);
}
```

---

## 11. Integration Points

### 11.1 API Endpoints

```typescript
// Fetch tasks by caso
GET /api/casos/{casoId}/tarefas
Response: Tarefa[]

// Update task status
PATCH /api/tarefas/{tarefaId}/status
Body: { status: 'em_progresso' }
Response: Tarefa

// Bulk update tasks
PATCH /api/tarefas/bulk
Body: { tarefaIds: string[], updates: Partial<Tarefa> }
Response: Tarefa[]
```

### 11.2 Real-time Updates (Future)

Use WebSockets or Server-Sent Events for real-time collaboration:

```typescript
const socket = useWebSocket(`/api/casos/${casoId}/tarefas/stream`);

socket.on('task:updated', (task: Tarefa) => {
  setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  toast.info(`Tarefa "${task.titulo}" foi atualizada`);
});

socket.on('task:created', (task: Tarefa) => {
  setTasks(prev => [...prev, task]);
  toast.success(`Nova tarefa criada: "${task.titulo}"`);
});
```

---

## Summary

This specification defines a complete Kanban board interface with:

✅ **4-column layout** (A Fazer, Em Progresso, Em Revisão, Concluído)  
✅ **Rich task cards** with priority, responsável, prazo, and metadata  
✅ **Drag-and-drop** with optimistic updates and error recovery  
✅ **Filtering & search** for finding tasks quickly  
✅ **Responsive design** for mobile, tablet, and desktop  
✅ **Accessibility** with keyboard navigation and screen reader support  
✅ **Performance optimizations** for large task lists  

The design balances visual clarity, information density, and user interactivity, providing a modern task management experience integrated into the case management workflow.
