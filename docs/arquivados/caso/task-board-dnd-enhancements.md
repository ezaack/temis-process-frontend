# Task Board Drag-and-Drop Enhancements

**Status**: Core DnD implemented ✅ | Phase 1 completed ✅ | Phase 2 completed ✅ | Phase 3 completed ✅
**File**: `src/features/caso/component/CasoTaskBoard.tsx`
**Library**: `@dnd-kit` v6.3.1 (already installed)

---

## Phase 1: Visual Feedback Enhancements ✅ COMPLETED

### Step 1.1: Enhanced Drag State Styling ✅
**File**: `CasoTaskBoard.tsx` (TaskCard component, lines 34-116)
**Status**: Implemented

**Action**: Update TaskCard return statement to add drag state classes:
```tsx
// Find: <div className="..." onClick={handleCardClick}>
// Add after isDragging check:
className={`
  relative rounded-lg border border-stroke bg-white p-4 shadow-sm cursor-pointer
  hover:shadow-md transition-all duration-200
  dark:border-strokedark dark:bg-boxdark
  ${isDragging ? 'opacity-50 rotate-2 scale-105 shadow-xl ring-2 ring-primary' : ''}
`}
```

**Expected**: Dragged cards show visual lift effect with rotation and ring.

---

### Step 1.2: Add Drop Zone Indicators ✅
**File**: `CasoTaskBoard.tsx` (StatusColumn component, lines 150-192)
**Status**: Implemented

**Action**: Import useDroppable and add drop zone styling:
```tsx
// Add import at top
import { useDroppable } from '@dnd-kit/core';

// In StatusColumn component, add after props destructure:
const { setNodeRef, isOver } = useDroppable({ id: status.id! });

// Update outer div to include ref and isOver styling:
<div 
  ref={setNodeRef}
  className={`
    flex-1 rounded-lg border border-stroke bg-gray-50 dark:bg-meta-4 
    transition-all duration-200
    ${isOver ? 'bg-primary/10 ring-2 ring-primary ring-dashed' : ''}
  `}
>
```

**Expected**: Columns highlight when task is dragged over them.

---

## Phase 2: Loading States & Error Handling ✅ COMPLETED

### Step 2.1: Add Loading State Management ✅
**File**: `CasoTaskBoard.tsx` (main component state, line ~340)
**Status**: Implemented

**Action**: Add state after existing useState declarations:
```tsx
const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(new Set());
```

---

### Step 2.2: Update handleDragEnd with Loading State ✅
**File**: `CasoTaskBoard.tsx` (handleDragEnd function, lines 464-535)
**Status**: Implemented

**Action**: Wrap API calls with loading state:
```tsx
// After: if (activeId === overId) return;
setUpdatingTaskIds(prev => new Set(prev).add(activeId));

try {
  if (activeStatusId === overStatusId) {
    // ... existing reorder logic
  } else {
    // ... existing move logic
  }
  toast.success('Sucesso', 'Tarefa atualizada');
} catch (error: any) {
  const message = error.response?.data?.message || 'Falha ao atualizar tarefa';
  toast.error('Erro', message);
  await loadBoardAndTasks();
} finally {
  setUpdatingTaskIds(prev => {
    const next = new Set(prev);
    next.delete(activeId);
    return next;
  });
}
```

---

### Step 2.3: Show Loading Indicator on Card ✅
**File**: `CasoTaskBoard.tsx` (TaskCard component, lines 34-116)
**Status**: Implemented

**Action**: Add loading prop and spinner:
```tsx
// Update interface (line ~24):
interface TaskCardProps {
  task: TarefaResource;
  isDragging?: boolean;
  dragListeners?: any;
  onClick?: (taskId: string) => void;
  isUpdating?: boolean;  // ADD THIS
}

// Add to TaskCard params:
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDragging = false,
  dragListeners,
  onClick,
  isUpdating = false,  // ADD THIS
}) => {

// Add loading overlay in return (after priority badge):
{isUpdating && (
  <div className="absolute inset-0 bg-white/80 dark:bg-boxdark/80 flex items-center justify-center rounded-lg">
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
  </div>
)}
```

---

### Step 2.4: Pass Loading State to Cards ✅
**File**: `CasoTaskBoard.tsx` (SortableTaskCard and StatusColumn, lines 118-192)
**Status**: Implemented

**Action**: Thread isUpdating prop through components:
```tsx
// In SortableTaskCard (line ~118), add prop:
const SortableTaskCard: React.FC<{ 
  task: TarefaResource; 
  onClick?: (taskId: string) => void;
  isUpdating?: boolean;  // ADD THIS
}> = ({ task, onClick, isUpdating }) => {

// Pass to TaskCard (line ~138):
<TaskCard 
  task={task} 
  isDragging={isDragging} 
  dragListeners={listeners}
  onClick={onClick}
  isUpdating={isUpdating}  // ADD THIS
/>

// In StatusColumn (line ~150), add prop:
const StatusColumn: React.FC<{
  status: StatusTarefaResource;
  tasks: TarefaResource[];
  onTaskClick?: (taskId: string) => void;
  updatingTaskIds?: Set<string>;  // ADD THIS
}> = ({ status, tasks, onTaskClick, updatingTaskIds }) => {

// Update SortableTaskCard call (line ~180):
<SortableTaskCard 
  task={task} 
  onClick={onTaskClick}
  isUpdating={updatingTaskIds?.has(task.id!)}  // ADD THIS
/>

// In main component return (line ~650), pass updatingTaskIds:
<StatusColumn
  status={status}
  tasks={tasksByStatus[status.id!] || []}
  onTaskClick={handleTaskClick}
  updatingTaskIds={updatingTaskIds}  // ADD THIS
/>
```

---

## Phase 3: Drag Handle & UX Polish ✅ COMPLETED

### Step 3.1: Add Explicit Drag Handle ✅
**File**: `CasoTaskBoard.tsx` (TaskCard component, lines 34-116)
**Status**: Implemented

**Action**: Add drag handle icon and update drag area:
```tsx
// In TaskCard return, add at top of card (after opening div):
<div 
  {...dragListeners}
  className="drag-handle absolute right-2 top-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-meta-4"
  aria-label="Arrastar tarefa"
>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
    <path d="M5 3a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm4-8a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2z"/>
  </svg>
</div>

// Remove dragListeners from TaskCard call in SortableTaskCard (line ~138)
// Pass them as prop instead for handle-only dragging
```

---

### Step 3.2: Keyboard Accessibility Hint ✅
**File**: `CasoTaskBoard.tsx` (main component return, lines 635-679)
**Status**: Implemented

**Action**: Add keyboard hint below board:
```tsx
// After DndContext closing tag, before closing fragment:
<div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zm0-2h12v1H2V3z"/>
  </svg>
  <span>Dica: Arraste tarefas entre colunas ou use Tab + Espaço para mover pelo teclado</span>
</div>
```

---

## Phase 4: Optional - Permission Guards (FUTURE)

### Step 4.1: Add Permission Check
**File**: `CasoTaskBoard.tsx` (add utility function near top)

**Action**: Add permission helper and use in drag config:
```tsx
// Add after imports:
const canUserDragTask = (task: TarefaResource, currentUserId?: string): boolean => {
  // Add your permission logic here
  // Example: return task.assignedTo === currentUserId || userIsAdmin;
  return true; // For now, allow all
};

// In SortableTaskCard (line ~128), add disabled:
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
  id: task.id!,
  disabled: !canUserDragTask(task, currentUserId)  // ADD THIS
});
```

---

## Testing Checklist

After each phase:
- [ ] Drag task within same column → reorders correctly
- [ ] Drag task to different column → status updates on backend
- [ ] Drag to empty column → works without errors
- [ ] Visual feedback appears during drag (Phase 1)
- [ ] Loading spinner shows during API call (Phase 2)
- [ ] Error toast shows if API fails (Phase 2)
- [ ] Task reverts position on error (Phase 2)
- [ ] Drag handle icon visible (Phase 3)
- [ ] Keyboard navigation works (Tab + Space)
- [ ] Mobile touch drag works

---

## API Integration Reference

**Endpoints Used** (already implemented in `tarefaService.ts`):
- `moveTarefa(groupId, taskId, newStatusId, newOrdem)` - Move between columns
- `reorderTarefa(groupId, taskId, newOrdem)` - Reorder within column

**Current State**:
- ✅ Optimistic UI updates
- ✅ Error rollback on failure
- ✅ Toast notifications
- ✅ Loading states (Phase 2)
- ✅ Enhanced visuals (Phase 1)
- ✅ Drag handle & UX polish (Phase 3)

---

## Token-Saving Implementation Notes

- All code snippets are copy-paste ready
- File paths and line numbers provided
- Each step is independently actionable
- No external documentation needed
- Search patterns included for precision
- Expected outcomes specified for validation

**Estimated Implementation Time**: 
- Phase 1: 30min
- Phase 2: 45min
- Phase 3: 20min
- Phase 4: 30min (if needed)

**Total**: ~2 hours for full enhancement suite
