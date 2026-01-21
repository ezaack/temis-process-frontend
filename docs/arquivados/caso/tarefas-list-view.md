# Tarefas: List View Design

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 6 of 8

---

## Overview

This document defines the detailed design specification for the **List View** of Tarefas (tasks) in the "Visualizar Caso" screen. The List view provides a tabular, data-dense representation of tasks that complements the visual Kanban board, enabling advanced filtering, sorting, and bulk operations.

---

## 1. List View Purpose & Use Cases

### When to Use List View vs Kanban

| Aspect | Kanban View | List View |
|--------|-------------|-----------|
| **Best For** | Visual workflow, quick status updates | Detailed analysis, filtering, reporting |
| **Information Density** | Low-Medium (cards) | High (table rows) |
| **Sorting** | Manual (drag & drop) | Multiple columns, persistent |
| **Filtering** | Visual scanning | Advanced multi-criteria |
| **Bulk Actions** | Limited | Full support (select multiple) |
| **Data Export** | Not ideal | Perfect for CSV export |
| **Screen Space** | More vertical scrolling | Compact, more items visible |

### Primary Use Cases
1. **Finding specific tasks** - Filter by multiple criteria
2. **Comparing tasks** - View all metadata side-by-side
3. **Bulk operations** - Update multiple tasks at once
4. **Reporting** - Export filtered data to CSV/Excel
5. **Detailed analysis** - Sort by any column to identify patterns

---

## 2. Layout Structure

### 2.1 Overall Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TAREFAS - CASO: [Case Title]                                               │
│  [+ Nova Tarefa]         [Filtros ▼]         [🎯 Board] [📋 List]          │
├─────────────────────────────────────────────────────────────────────────────┤
│  📋 LIST VIEW                                                                │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Filters Bar (Expandable)                                                ││
│  │ [Status ▼] [Responsável ▼] [Prioridade ▼] [Prazo ▼] [Buscar...] [Clear]││
│  │ Showing 15 of 23 tasks                                                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Bulk Actions Bar (Shown when items selected)                            ││
│  │ 5 selected    [Change Status ▼] [Assign to ▼] [Delete] [Deselect All] ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│  ┌──┬──────┬─────────────────────┬───────────┬────────────┬──────────┬─────┐│
│  │☐ │ ID   │ Título              │ Status    │ Responsável│ Prioridade│Prazo││
│  ├──┼──────┼─────────────────────┼───────────┼────────────┼──────────┼─────┤│
│  │☑ │T-001 │Analisar documentos  │A Fazer    │João Silva  │[!]Urgente│2d   ││
│  │☐ │T-002 │Revisar petição      │Em Progr.  │Maria S.    │[-]Alta   │5d   ││
│  │☐ │T-003 │Protocolar recurso   │Em Revisão │Pedro Costa │[-]Normal │-    ││
│  │☑ │T-004 │Elaborar parecer     │A Fazer    │João Silva  │[!]Urgente│1d   ││
│  │☐ │T-005 │Contatar cliente     │Concluído  │Ana Lima    │[-]Baixa  │-    ││
│  │  │ ...  │                     │           │            │          │     ││
│  └──┴──────┴─────────────────────┴───────────┴────────────┴──────────┴─────┘│
│                                                                               │
│  [< Previous]  Page 1 of 3  [Next >]                    [10 | 25 | 50 ▼]   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Structure

```tsx
<div className="tarefas-list-view">
  {/* Header with view toggle */}
  <ListViewHeader />
  
  {/* Filter bar */}
  <FilterBar filters={filters} onFiltersChange={setFilters} />
  
  {/* Bulk actions bar (conditional) */}
  {selectedTasks.length > 0 && (
    <BulkActionsBar selectedTasks={selectedTasks} onBulkAction={handleBulkAction} />
  )}
  
  {/* Table */}
  <TaskTable
    tasks={filteredTasks}
    sortConfig={sortConfig}
    onSortChange={handleSort}
    selectedIds={selectedIds}
    onSelectChange={handleSelect}
  />
  
  {/* Pagination */}
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    pageSize={pageSize}
    onPageChange={setCurrentPage}
    onPageSizeChange={setPageSize}
  />
</div>
```

---

## 3. Table Column Definitions

### 3.1 Column Specifications

| Column | Label | Width | Sortable | Filterable | Priority | Display Format |
|--------|-------|-------|----------|------------|----------|----------------|
| **Checkbox** | ☐ | 40px | No | No | Critical | Checkbox |
| **ID** | ID | 80px | Yes | Yes | High | `T-{shortId}` |
| **Título** | Título | Flex (min 200px) | Yes | Yes | Critical | Text (truncate at 50 chars) |
| **Status** | Status | 120px | Yes | Yes | Critical | Badge |
| **Responsável** | Responsável | 150px | Yes | Yes | High | Avatar + Name (truncate) |
| **Criador** | Criado por | 150px | Yes | Yes | Medium | Name (truncate) |
| **Prioridade** | Prioridade | 100px | Yes | Yes | High | Badge with icon |
| **Prazo** | Prazo | 100px | Yes | Yes | High | Relative time or date |
| **Tipo** | Tipo | 100px | Yes | Yes | Medium | Badge |
| **Estimativa** | Est. | 80px | Yes | No | Low | Hours format |
| **Criado Em** | Criado | 100px | Yes | Yes | Low | Relative time |
| **Actions** | Ações | 100px | No | No | High | Icon buttons |

### 3.2 Column Visibility

**Default Visible Columns**:
- ☐ Checkbox
- ID
- Título
- Status
- Responsável
- Prioridade
- Prazo
- Actions

**Hidden by Default** (Show via column picker):
- Criador
- Tipo
- Estimativa
- Criado Em

**Column Picker Button**:
```tsx
<button className="btn-icon" onClick={openColumnPicker}>
  ⚙️ Colunas
</button>

<ColumnPickerModal>
  {columns.map(col => (
    <Checkbox
      key={col.id}
      label={col.label}
      checked={col.visible}
      onChange={() => toggleColumn(col.id)}
      disabled={col.required}
    />
  ))}
</ColumnPickerModal>
```

### 3.3 Responsive Column Behavior

#### Desktop (>1024px)
- All default columns visible
- Full width for titles
- Show full names

#### Tablet (640px - 1024px)
- Hide: Criador, Tipo, Estimativa
- Truncate titles to 40 chars
- Abbreviate names (first name + initial)

#### Mobile (<640px)
- **Card-based list instead of table**
- Show: Title, Status, Responsável, Prazo
- Stack information vertically
- Swipe actions for quick status change

```tsx
// Mobile Card Layout
<div className="mobile-task-card">
  <div className="flex items-start justify-between">
    <Checkbox />
    <div className="flex-1 ml-3">
      <h4 className="font-semibold">{task.titulo}</h4>
      <div className="flex gap-2 mt-2">
        <StatusBadge status={task.status} />
        <PrioridadeBadge prioridade={task.prioridade} />
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm text-bodydark">
        <Avatar size="xs" user={task.responsavel} />
        <span>{task.responsavel?.nome}</span>
      </div>
      {task.prazo && (
        <div className="mt-2 text-sm text-warning">
          ⏰ {formatRelativeTime(task.prazo)}
        </div>
      )}
    </div>
    <DropdownMenu>
      <MenuItem onClick={() => onEdit(task)}>Editar</MenuItem>
      <MenuItem onClick={() => onChangeStatus(task)}>Alterar Status</MenuItem>
      <MenuItem onClick={() => onDelete(task)}>Excluir</MenuItem>
    </DropdownMenu>
  </div>
</div>
```

---

## 4. Sorting Functionality

### 4.1 Sort Configuration

```typescript
interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

interface SortableColumn {
  id: string;
  label: string;
  sortFn: (a: Tarefa, b: Tarefa) => number;
  defaultDirection: 'asc' | 'desc';
}
```

### 4.2 Default Sort Order

**Default**: Sort by **Prioridade** (descending) → **Prazo** (ascending) → **Criado Em** (descending)

This ensures:
1. Urgent tasks appear first
2. Within same priority, earliest deadlines first
3. Within same deadline, newest tasks first

### 4.3 Sort Implementations

```typescript
const sortFunctions: Record<string, (a: Tarefa, b: Tarefa) => number> = {
  id: (a, b) => a.id.localeCompare(b.id),
  
  titulo: (a, b) => a.titulo.localeCompare(b.titulo),
  
  status: (a, b) => {
    const statusOrder = ['a_fazer', 'em_progresso', 'em_revisao', 'concluido'];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  },
  
  responsavel: (a, b) => {
    const nameA = a.responsavel?.nome || '';
    const nameB = b.responsavel?.nome || '';
    return nameA.localeCompare(nameB);
  },
  
  prioridade: (a, b) => {
    const prioridadeOrder = ['urgente', 'alta', 'normal', 'baixa'];
    return prioridadeOrder.indexOf(a.prioridade) - prioridadeOrder.indexOf(b.prioridade);
  },
  
  prazo: (a, b) => {
    if (!a.prazo && !b.prazo) return 0;
    if (!a.prazo) return 1; // No deadline goes to end
    if (!b.prazo) return -1;
    return new Date(a.prazo).getTime() - new Date(b.prazo).getTime();
  },
  
  estimativaHoras: (a, b) => {
    const estA = a.estimativaHoras || 0;
    const estB = b.estimativaHoras || 0;
    return estA - estB;
  },
  
  criadoEm: (a, b) => {
    return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
  }
};

function applySorting(tasks: Tarefa[], sortConfig: SortConfig): Tarefa[] {
  const sortFn = sortFunctions[sortConfig.column];
  if (!sortFn) return tasks;
  
  const sorted = [...tasks].sort(sortFn);
  return sortConfig.direction === 'desc' ? sorted.reverse() : sorted;
}
```

### 4.4 Column Header with Sort Indicator

```tsx
interface SortableHeaderProps {
  column: string;
  label: string;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

function SortableHeader({ column, label, sortConfig, onSort }: SortableHeaderProps) {
  const isActive = sortConfig.column === column;
  const direction = isActive ? sortConfig.direction : null;
  
  return (
    <th
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-meta-4 select-none"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {isActive ? (
          direction === 'asc' ? (
            <span className="text-primary">↑</span>
          ) : (
            <span className="text-primary">↓</span>
          )
        ) : (
          <span className="text-bodydark2 opacity-50">↕</span>
        )}
      </div>
    </th>
  );
}
```

### 4.5 Sort Interaction Flow

```
User clicks column header
        ↓
Is column already sorted?
  ├─ No  → Sort ascending
  └─ Yes → Toggle direction (asc ↔ desc)
        ↓
Update sortConfig state
        ↓
Re-render table with new sort order
        ↓
Persist sort preference to localStorage
```

---

## 5. Filtering Functionality

### 5.1 Filter Configuration

```typescript
interface FilterConfig {
  status?: string[];
  prioridade?: string[];
  responsavelId?: string[];
  criadorId?: string[];
  tipo?: string[];
  prazoRange?: {
    start?: string;
    end?: string;
  };
  overdue?: boolean;
  noPrazo?: boolean;
  search?: string; // Search in título and descrição
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number; // Number of tasks matching this filter
}
```

### 5.2 Filter Bar Design

```tsx
function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeFilterCount = countActiveFilters(filters);
  
  return (
    <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Filters (always visible) */}
          <StatusFilter
            value={filters.status || []}
            onChange={(status) => onFiltersChange({ ...filters, status })}
          />
          
          <ResponsavelFilter
            value={filters.responsavelId || []}
            onChange={(responsavelId) => onFiltersChange({ ...filters, responsavelId })}
          />
          
          <PrioridadeFilter
            value={filters.prioridade || []}
            onChange={(prioridade) => onFiltersChange({ ...filters, prioridade })}
          />
          
          <SearchInput
            value={filters.search || ''}
            onChange={(search) => onFiltersChange({ ...filters, search })}
            placeholder="Buscar tarefas..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={() => onFiltersChange({})}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Limpar filtros ({activeFilterCount})
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-bodydark hover:text-body"
          >
            {isExpanded ? '▲ Menos filtros' : '▼ Mais filtros'}
          </button>
        </div>
      </div>
      
      {/* Advanced Filters (collapsible) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-stroke dark:border-strokedark">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CriadorFilter
              value={filters.criadorId || []}
              onChange={(criadorId) => onFiltersChange({ ...filters, criadorId })}
            />
            
            <TipoFilter
              value={filters.tipo || []}
              onChange={(tipo) => onFiltersChange({ ...filters, tipo })}
            />
            
            <PrazoRangeFilter
              value={filters.prazoRange}
              onChange={(prazoRange) => onFiltersChange({ ...filters, prazoRange })}
            />
            
            <QuickFilters>
              <Checkbox
                label="Apenas vencidas"
                checked={filters.overdue || false}
                onChange={(overdue) => onFiltersChange({ ...filters, overdue })}
              />
              <Checkbox
                label="Sem prazo definido"
                checked={filters.noPrazo || false}
                onChange={(noPrazo) => onFiltersChange({ ...filters, noPrazo })}
              />
            </QuickFilters>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 5.3 Individual Filter Components

#### Status Filter (Multi-select Dropdown)

```tsx
function StatusFilter({ value, onChange }: FilterProps<string[]>) {
  const statusOptions: FilterOption[] = [
    { id: 'a_fazer', label: 'A Fazer', value: 'a_fazer' },
    { id: 'em_progresso', label: 'Em Progresso', value: 'em_progresso' },
    { id: 'em_revisao', label: 'Em Revisão', value: 'em_revisao' },
    { id: 'concluido', label: 'Concluído', value: 'concluido' }
  ];
  
  return (
    <MultiSelectDropdown
      label="Status"
      options={statusOptions}
      value={value}
      onChange={onChange}
      placeholder="Todos os status"
    />
  );
}
```

#### Responsável Filter (Multi-select with search)

```tsx
function ResponsavelFilter({ value, onChange }: FilterProps<string[]>) {
  const { data: employees } = useEmployees(); // Fetch from API
  
  const options: FilterOption[] = employees.map(emp => ({
    id: emp.id,
    label: emp.nome,
    value: emp.id
  }));
  
  return (
    <MultiSelectDropdown
      label="Responsável"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Todos os responsáveis"
      searchable
    />
  );
}
```

#### Search Input (Debounced)

```tsx
function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  
  // Debounce search to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localValue]);
  
  return (
    <div className="relative">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-stroke bg-gray py-2 pl-10 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark">
        🔍
      </span>
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-bodydark hover:text-body"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

### 5.4 Filter Application Logic

```typescript
function applyFilters(tasks: Tarefa[], filters: FilterConfig): Tarefa[] {
  let filtered = [...tasks];
  
  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(task => filters.status!.includes(task.status));
  }
  
  // Prioridade filter
  if (filters.prioridade && filters.prioridade.length > 0) {
    filtered = filtered.filter(task => filters.prioridade!.includes(task.prioridade));
  }
  
  // Responsável filter
  if (filters.responsavelId && filters.responsavelId.length > 0) {
    filtered = filtered.filter(task => 
      task.responsavelId && filters.responsavelId!.includes(task.responsavelId)
    );
  }
  
  // Criador filter
  if (filters.criadorId && filters.criadorId.length > 0) {
    filtered = filtered.filter(task => 
      filters.criadorId!.includes(task.criadoPor)
    );
  }
  
  // Tipo filter
  if (filters.tipo && filters.tipo.length > 0) {
    filtered = filtered.filter(task => 
      task.tipo && filters.tipo!.includes(task.tipo)
    );
  }
  
  // Prazo range filter
  if (filters.prazoRange) {
    if (filters.prazoRange.start) {
      filtered = filtered.filter(task => 
        task.prazo && new Date(task.prazo) >= new Date(filters.prazoRange!.start!)
      );
    }
    if (filters.prazoRange.end) {
      filtered = filtered.filter(task => 
        task.prazo && new Date(task.prazo) <= new Date(filters.prazoRange!.end!)
      );
    }
  }
  
  // Overdue filter
  if (filters.overdue) {
    const now = new Date();
    filtered = filtered.filter(task => 
      task.prazo && new Date(task.prazo) < now
    );
  }
  
  // No prazo filter
  if (filters.noPrazo) {
    filtered = filtered.filter(task => !task.prazo);
  }
  
  // Search filter (título + descrição)
  if (filters.search && filters.search.trim().length > 0) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(task => 
      task.titulo.toLowerCase().includes(searchLower) ||
      (task.descricao && task.descricao.toLowerCase().includes(searchLower))
    );
  }
  
  return filtered;
}
```

---

## 6. Bulk Actions

### 6.1 Bulk Action Bar

```tsx
interface BulkActionsBarProps {
  selectedTasks: Tarefa[];
  onBulkAction: (action: BulkAction) => void;
  onDeselectAll: () => void;
}

function BulkActionsBar({ selectedTasks, onBulkAction, onDeselectAll }: BulkActionsBarProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-sm border border-primary bg-primary/10 p-3 dark:border-primary dark:bg-primary/20">
      <div className="flex items-center gap-3">
        <span className="font-medium text-primary">
          {selectedTasks.length} {selectedTasks.length === 1 ? 'tarefa selecionada' : 'tarefas selecionadas'}
        </span>
        
        <button
          onClick={onDeselectAll}
          className="text-sm text-bodydark hover:text-body"
        >
          Desmarcar todas
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu
          trigger={
            <button className="btn-secondary">
              Alterar Status ▼
            </button>
          }
        >
          <MenuItem onClick={() => onBulkAction({ type: 'change_status', status: 'a_fazer' })}>
            A Fazer
          </MenuItem>
          <MenuItem onClick={() => onBulkAction({ type: 'change_status', status: 'em_progresso' })}>
            Em Progresso
          </MenuItem>
          <MenuItem onClick={() => onBulkAction({ type: 'change_status', status: 'em_revisao' })}>
            Em Revisão
          </MenuItem>
          <MenuItem onClick={() => onBulkAction({ type: 'change_status', status: 'concluido' })}>
            Concluído
          </MenuItem>
        </DropdownMenu>
        
        <DropdownMenu
          trigger={
            <button className="btn-secondary">
              Atribuir a ▼
            </button>
          }
        >
          {employees.map(emp => (
            <MenuItem
              key={emp.id}
              onClick={() => onBulkAction({ type: 'assign', employeeId: emp.id })}
            >
              {emp.nome}
            </MenuItem>
          ))}
        </DropdownMenu>
        
        <DropdownMenu
          trigger={
            <button className="btn-secondary">
              Alterar Prioridade ▼
            </button>
          }
        >
          <MenuItem onClick={() => onBulkAction({ type: 'change_priority', prioridade: 'urgente' })}>
            🔴 Urgente
          </MenuItem>
          <MenuItem onClick={() => onBulkAction({ type: 'change_priority', prioridade: 'alta' })}>
            🟡 Alta
          </MenuItem>
          <MenuItem onClick={() => onBulkAction({ type: 'change_priority', prioridade: 'normal' })}>
            🟢 Normal
          </MenuItem>
          <MenuItem onClick={() => onBulkAction({ type: 'change_priority', prioridade: 'baixa' })}>
            ⚪ Baixa
          </MenuItem>
        </DropdownMenu>
        
        <button
          onClick={() => onBulkAction({ type: 'delete' })}
          className="btn-danger"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
}
```

### 6.2 Bulk Action Types

```typescript
type BulkAction =
  | { type: 'change_status'; status: Tarefa['status'] }
  | { type: 'assign'; employeeId: string }
  | { type: 'change_priority'; prioridade: Tarefa['prioridade'] }
  | { type: 'delete' };

async function handleBulkAction(action: BulkAction, selectedIds: string[]) {
  // Show confirmation for destructive actions
  if (action.type === 'delete') {
    const confirmed = await confirm({
      title: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir ${selectedIds.length} tarefas? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      confirmColor: 'danger'
    });
    
    if (!confirmed) return;
  }
  
  // Show loading state
  setIsLoading(true);
  
  try {
    // Process bulk action
    switch (action.type) {
      case 'change_status':
        await bulkUpdateTaskStatus(selectedIds, action.status);
        toast.success(`Status de ${selectedIds.length} tarefas atualizado`);
        break;
        
      case 'assign':
        await bulkAssignTasks(selectedIds, action.employeeId);
        toast.success(`${selectedIds.length} tarefas atribuídas`);
        break;
        
      case 'change_priority':
        await bulkUpdateTaskPriority(selectedIds, action.prioridade);
        toast.success(`Prioridade de ${selectedIds.length} tarefas atualizada`);
        break;
        
      case 'delete':
        await bulkDeleteTasks(selectedIds);
        toast.success(`${selectedIds.length} tarefas excluídas`);
        break;
    }
    
    // Refresh task list
    await refetchTasks();
    
    // Deselect all
    setSelectedIds([]);
    
  } catch (error) {
    toast.error('Erro ao processar ação em lote. Tente novamente.');
    console.error('Bulk action error:', error);
  } finally {
    setIsLoading(false);
  }
}
```

### 6.3 Selection Management

```typescript
interface SelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isPartialSelection: boolean;
}

function useTaskSelection(tasks: Tarefa[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const isAllSelected = tasks.length > 0 && selectedIds.size === tasks.length;
  const isPartialSelection = selectedIds.size > 0 && selectedIds.size < tasks.length;
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map(t => t.id)));
    }
  };
  
  const toggleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };
  
  const deselectAll = () => {
    setSelectedIds(new Set());
  };
  
  return {
    selectedIds,
    isAllSelected,
    isPartialSelection,
    toggleSelectAll,
    toggleSelectOne,
    deselectAll
  };
}
```

---

## 7. Pagination

### 7.1 Pagination Configuration

```typescript
interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;
```

### 7.2 Pagination Component

```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className="flex items-center justify-between border-t border-stroke bg-white px-4 py-3 dark:border-strokedark dark:bg-boxdark sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        {/* Item range info */}
        <div className="text-sm text-bodydark">
          Exibindo <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> tarefas
        </div>
        
        {/* Page controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹ Anterior
          </button>
          
          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {generatePageNumbers(currentPage, totalPages).map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-bodydark">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`
                    px-3 py-1 rounded
                    ${currentPage === page
                      ? 'bg-primary text-white font-medium'
                      : 'bg-gray-2 text-body hover:bg-gray-3 dark:bg-meta-4 dark:text-bodydark1'
                    }
                  `}
                >
                  {page}
                </button>
              )
            ))}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo ›
          </button>
          
          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-4 rounded border border-stroke bg-gray py-2 px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  // Always show: [1] ... [current-1] [current] [current+1] ... [total]
  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page
    pages.push(totalPages);
  }
  
  return pages;
}
```

---

## 8. View Toggle Behavior

### 8.1 Toggle Component

```tsx
interface ViewToggleProps {
  currentView: 'board' | 'list';
  onChange: (view: 'board' | 'list') => void;
}

function ViewToggle({ currentView, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-stroke bg-gray-2 p-1 dark:border-strokedark dark:bg-meta-4">
      <button
        onClick={() => onChange('board')}
        className={`
          flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors
          ${currentView === 'board'
            ? 'bg-white text-primary shadow-sm dark:bg-boxdark'
            : 'text-bodydark hover:text-body'
          }
        `}
      >
        🎯 Board
      </button>
      
      <button
        onClick={() => onChange('list')}
        className={`
          flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors
          ${currentView === 'list'
            ? 'bg-white text-primary shadow-sm dark:bg-boxdark'
            : 'text-bodydark hover:text-body'
          }
        `}
      >
        📋 List
      </button>
    </div>
  );
}
```

### 8.2 View State Persistence

```typescript
// Persist view preference to localStorage
function useTarefasView() {
  const [view, setView] = useState<'board' | 'list'>(() => {
    const saved = localStorage.getItem('tarefas_view');
    return (saved as 'board' | 'list') || 'board';
  });
  
  const changeView = (newView: 'board' | 'list') => {
    setView(newView);
    localStorage.setItem('tarefas_view', newView);
  };
  
  return { view, changeView };
}
```

### 8.3 Shared State Between Views

Both views share the same data source and state:

```typescript
interface TarefasTabState {
  // Data
  tasks: Tarefa[];
  isLoading: boolean;
  error: Error | null;
  
  // View
  currentView: 'board' | 'list';
  
  // Filters (apply to both views)
  filters: FilterConfig;
  
  // Sort (list view only)
  sortConfig: SortConfig;
  
  // Selection (list view only)
  selectedIds: Set<string>;
  
  // Pagination (list view only)
  currentPage: number;
  pageSize: number;
}

function CasoTarefasTab({ casoId }: { casoId: string }) {
  const { view, changeView } = useTarefasView();
  const [filters, setFilters] = useState<FilterConfig>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'prioridade',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  
  // Fetch tasks
  const { data: tasks, isLoading, error } = useTasks(casoId);
  
  // Apply filters
  const filteredTasks = useMemo(() => 
    applyFilters(tasks || [], filters),
    [tasks, filters]
  );
  
  // Apply sorting (list view only)
  const sortedTasks = useMemo(() => 
    view === 'list' ? applySorting(filteredTasks, sortConfig) : filteredTasks,
    [filteredTasks, sortConfig, view]
  );
  
  // Apply pagination (list view only)
  const paginatedTasks = useMemo(() => {
    if (view === 'list') {
      const start = (currentPage - 1) * pageSize;
      return sortedTasks.slice(start, start + pageSize);
    }
    return sortedTasks;
  }, [sortedTasks, currentPage, pageSize, view]);
  
  return (
    <div>
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-4">
        <button className="btn-primary">
          + Nova Tarefa
        </button>
        
        <ViewToggle currentView={view} onChange={changeView} />
      </div>
      
      {/* Filter bar (shared) */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />
      
      {/* View-specific content */}
      {view === 'board' ? (
        <CasoTaskBoard
          tasks={filteredTasks}
          onTaskUpdate={refetchTasks}
        />
      ) : (
        <>
          <CasoTaskList
            tasks={paginatedTasks}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedTasks.length / pageSize)}
            pageSize={pageSize}
            totalItems={sortedTasks.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1); // Reset to first page
            }}
          />
        </>
      )}
    </div>
  );
}
```

---

## 9. Row Actions

### 9.1 Action Buttons

Each row has quick action buttons on the right:

```tsx
function TaskRowActions({ task, onEdit, onDelete, onView }: TaskRowActionsProps) {
  return (
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(task)}
          className="hover:text-primary"
          title="Ver detalhes"
        >
          👁️
        </button>
        
        <button
          onClick={() => onEdit(task)}
          className="hover:text-primary"
          title="Editar"
        >
          ✏️
        </button>
        
        <button
          onClick={() => onDelete(task)}
          className="hover:text-danger"
          title="Excluir"
        >
          🗑️
        </button>
        
        <DropdownMenu
          trigger={
            <button className="hover:text-primary" title="Mais ações">
              ⋮
            </button>
          }
        >
          <MenuItem onClick={() => handleDuplicate(task)}>
            Duplicar tarefa
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus(task)}>
            Alterar status
          </MenuItem>
          <MenuItem onClick={() => handleAssign(task)}>
            Atribuir a alguém
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => handleArchive(task)} className="text-warning">
            Arquivar
          </MenuItem>
        </DropdownMenu>
      </div>
    </td>
  );
}
```

### 9.2 Row Click Behavior

```tsx
function TaskRow({ task, isSelected, onSelect, onRowClick }: TaskRowProps) {
  return (
    <tr
      onClick={(e) => {
        // Don't trigger row click if clicking checkbox or action buttons
        if (
          (e.target as HTMLElement).closest('input[type="checkbox"]') ||
          (e.target as HTMLElement).closest('.actions-column')
        ) {
          return;
        }
        onRowClick(task);
      }}
      className={`
        cursor-pointer transition-colors
        hover:bg-gray-2 dark:hover:bg-meta-4
        ${isSelected ? 'bg-primary/10 dark:bg-primary/20' : ''}
      `}
    >
      {/* Row content */}
    </tr>
  );
}
```

---

## 10. Empty States

### 10.1 No Tasks

```tsx
function EmptyTaskList() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
        Nenhuma tarefa encontrada
      </h3>
      <p className="text-bodydark text-center mb-6">
        Crie sua primeira tarefa para começar a organizar o trabalho deste caso.
      </p>
      <button className="btn-primary" onClick={onCreateTask}>
        + Criar Primeira Tarefa
      </button>
    </div>
  );
}
```

### 10.2 No Results from Filters

```tsx
function NoFilterResults({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
        Nenhuma tarefa corresponde aos filtros
      </h3>
      <p className="text-bodydark text-center mb-6">
        Tente ajustar ou limpar os filtros para ver mais resultados.
      </p>
      <button className="btn-secondary" onClick={onClearFilters}>
        Limpar Filtros
      </button>
    </div>
  );
}
```

---

## 11. Loading States

```tsx
function TaskListSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="px-4 py-4">☐</th>
            <th className="px-4 py-4">ID</th>
            <th className="px-4 py-4">Título</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Responsável</th>
            <th className="px-4 py-4">Prioridade</th>
            <th className="px-4 py-4">Prazo</th>
            <th className="px-4 py-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <tr key={i} className="border-b border-stroke dark:border-strokedark">
              <td className="px-4 py-3">
                <div className="h-4 w-4 bg-gray-3 animate-pulse rounded"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-gray-3 animate-pulse rounded"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-48 bg-gray-3 animate-pulse rounded"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-6 w-24 bg-gray-3 animate-pulse rounded"></div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-3 animate-pulse rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-3 animate-pulse rounded"></div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="h-6 w-20 bg-gray-3 animate-pulse rounded"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-gray-3 animate-pulse rounded"></div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-3 animate-pulse rounded"></div>
                  <div className="h-6 w-6 bg-gray-3 animate-pulse rounded"></div>
                  <div className="h-6 w-6 bg-gray-3 animate-pulse rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 12. Export Functionality

### 12.1 Export Button

```tsx
function ExportButton({ tasks, filters }: { tasks: Tarefa[], filters: FilterConfig }) {
  return (
    <DropdownMenu
      trigger={
        <button className="btn-secondary">
          📥 Exportar
        </button>
      }
    >
      <MenuItem onClick={() => exportToCSV(tasks)}>
        Exportar como CSV
      </MenuItem>
      <MenuItem onClick={() => exportToExcel(tasks)}>
        Exportar como Excel
      </MenuItem>
      <MenuItem onClick={() => exportToPDF(tasks)}>
        Exportar como PDF
      </MenuItem>
    </DropdownMenu>
  );
}
```

### 12.2 CSV Export Implementation

```typescript
function exportToCSV(tasks: Tarefa[]) {
  const headers = [
    'ID',
    'Título',
    'Descrição',
    'Status',
    'Responsável',
    'Criador',
    'Prioridade',
    'Prazo',
    'Estimativa (horas)',
    'Criado em',
    'Atualizado em'
  ];
  
  const rows = tasks.map(task => [
    task.id,
    task.titulo,
    task.descricao || '',
    task.status,
    task.responsavel?.nome || '',
    task.criador?.nome || '',
    task.prioridade,
    task.prazo ? format(new Date(task.prazo), 'dd/MM/yyyy HH:mm') : '',
    task.estimativaHoras || '',
    format(new Date(task.criadoEm), 'dd/MM/yyyy HH:mm'),
    format(new Date(task.atualizadoEm), 'dd/MM/yyyy HH:mm')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tarefas_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
```

---

## 13. Accessibility

### 13.1 Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between rows and interactive elements |
| `Space` | Toggle checkbox selection on focused row |
| `Enter` | Open task detail view for focused row |
| `Arrow Up/Down` | Navigate between rows |
| `Shift + Click` | Select range of rows |
| `Cmd/Ctrl + A` | Select all visible rows |
| `Escape` | Deselect all rows |

### 13.2 ARIA Labels

```tsx
<table role="table" aria-label="Lista de tarefas">
  <thead role="rowgroup">
    <tr role="row">
      <th role="columnheader" scope="col" aria-sort={getSortDirection('id')}>
        ID
      </th>
      {/* ... */}
    </tr>
  </thead>
  <tbody role="rowgroup">
    <tr
      role="row"
      aria-selected={isSelected}
      aria-label={`Tarefa: ${task.titulo}`}
    >
      <td role="cell">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          aria-label={`Selecionar tarefa ${task.titulo}`}
        />
      </td>
      {/* ... */}
    </tr>
  </tbody>
</table>
```

---

## 14. Performance Optimizations

### 14.1 Virtualization for Large Lists

For cases with 100+ tasks, implement virtual scrolling:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedTaskList({ tasks }: { tasks: Tarefa[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5 // Render 5 extra rows above/below viewport
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const task = tasks[virtualRow.index];
          return (
            <div
              key={task.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <TaskRow task={task} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 14.2 Memoization

```typescript
const TaskRow = memo(function TaskRow({ task, isSelected, onSelect }: TaskRowProps) {
  // Row implementation
}, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.task.atualizadoEm === nextProps.task.atualizadoEm
  );
});
```

---

## Summary

The List View provides a powerful, data-dense interface for task management with:

- **Comprehensive filtering** - Multi-criteria search and filter
- **Flexible sorting** - Sort by any column
- **Bulk operations** - Update multiple tasks at once
- **Export functionality** - CSV/Excel/PDF export
- **Responsive design** - Works on all screen sizes
- **Accessibility** - Full keyboard navigation and ARIA support
- **Performance** - Virtualization for large datasets

This complements the visual Kanban view, giving users the best tool for their specific workflow needs.
