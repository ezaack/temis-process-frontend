# Tarefa PATCH Method Implementation Improvements

## ⚠️ CRITICAL: PATCH Best Practices

**ONLY SEND CHANGED FIELDS** - Never send the entire resource object in PATCH requests!

✅ **CORRECT:**
```typescript
// Only sending the field that changed
await tarefaService.updateTarefa(groupId, tarefaId, { titulo: newTitle });
```

❌ **INCORRECT:**
```typescript
// Sending the entire task object (this defeats the purpose of PATCH)
await tarefaService.updateTarefa(groupId, tarefaId, { 
  id, statusId, colaboradorId, titulo: newTitle, 
  descricao, solucaoProposta, ordem, prazo, estimativaHoras, prioridade 
});
```

---

## Overview
The API now supports a PATCH method for `/v0/office-group/{groupId}/tarefas/{tarefaId}`, which allows partial updates to tasks. This document identifies all areas in the codebase that should be migrated from PUT to PATCH for more efficient and semantically correct updates.

## Benefits of Using PATCH
- **Efficiency**: Only send changed fields instead of the entire resource
- **Semantic Correctness**: PATCH is designed for partial updates (RFC 5789)
- **Reduced Payload Size**: Less data transferred over the network (80-90% reduction)
- **Better Error Handling**: Clearer intent when updating specific fields
- **Optimistic UI Updates**: Easier to implement and rollback specific field changes
- **Reduced Server Load**: Backend only processes changed fields
- **Fewer Conflicts**: Lower chance of overwriting concurrent changes to other fields

---

## Implementation Checklist

### 1. Core Service Layer

#### ✅ `src/features/caso/api/tarefaService.ts` - COMPLETED ✅

- [x] **Update `updateTarefa` method to use PATCH**
  - ✅ Changed from PUT to PATCH on line 40
  - ✅ Successfully updated: `await apiClient.patch(...)` 
  - Impact: All components using this service now benefit from PATCH semantics
  - Notes: The method already accepts `Partial<TarefaResource>`, which is perfect for PATCH semantics
  - ⚠️ **IMPORTANT**: This method should ONLY be called with the fields that are changing

```typescript
// Current implementation:
updateTarefa: async (groupId: string, tarefaId: string, data: Partial<TarefaResource>): Promise<TarefaResource> => {
  const response = await apiClient.put(`/office-group/${groupId}/tarefas/${tarefaId}`, data);
  return response.data;
},

// Proposed implementation:
updateTarefa: async (groupId: string, tarefaId: string, data: Partial<TarefaResource>): Promise<TarefaResource> => {
  const response = await apiClient.patch(`/office-group/${groupId}/tarefas/${tarefaId}`, data);
  return response.data;
},
```

---

### 2. Task Detail View Components

#### ✅ `src/features/caso/component/TarefaView.tsx`

**GOOD NEWS**: This component already follows best practices! ✅

The `handleUpdate` function (line ~95) accepts `Partial<TarefaDetailResource>` and all callers already send ONLY the changed field:

```typescript
// ALREADY CORRECT - Only sends changed field
handleUpdate({ titulo: tempTitle.trim() });
handleUpdate({ statusId });
handleUpdate({ colaboradorId });
handleUpdate({ prioridade });
```

This component has multiple inline edit operations that already follow PATCH semantics:

- [x] **Title Updates** (Line ~119) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ titulo: tempTitle.trim() })`
  - Only sends the `titulo` field
  - User Action: Inline editing of task title
  
- [x] **Description Updates** (Line ~127) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ descricao: tempDescription || undefined })`
  - Only sends the `descricao` field
  - User Action: Inline editing of task description
  
- [x] **Solution Proposal Updates** (Line ~135) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ solucaoProposta: tempSolution || undefined })`
  - Only sends the `solucaoProposta` field
  - User Action: Inline editing of solution field
  
- [x] **Status Changes** (Line ~540) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ statusId })`
  - Only sends the `statusId` field
  - User Action: Status dropdown selection
  
- [x] **Assignee Changes** (Line ~558) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ colaboradorId: colaboradorId || undefined })`
  - Only sends the `colaboradorId` field
  - User Action: Employee selector change
  
- [x] **Priority Changes** (Line ~575) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ prioridade: e.target.value as PrioridadeTarefa })`
  - Only sends the `prioridade` field
  - User Action: Priority dropdown selection
  
- [x] **Due Date Changes** (Line ~593) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ prazo: e.target.value || undefined })`
  - Only sends the `prazo` field
  - User Action: Date picker selection
  
- [x] **Estimated Hours Changes** (Line ~610) - ✅ VERIFIED
  - ✅ Correct: Calls `handleUpdate({ estimativaHoras: parseFloat(e.target.value) || undefined })`
  - Only sends the `estimativaHoras` field
  - User Action: Number input change

**Total Inline Updates in TarefaView: 8 different field updates**
**Implementation Status: ✅ VERIFIED - Follows PATCH best practices perfectly!**

---

#### ✅ `src/features/caso/component/TarefaViewModal.tsx`

**GOOD NEWS**: This component also already follows best practices! ✅

Similar to TarefaView but in modal format. The `handleUpdate` function already accepts partial updates and all callers send only changed fields:

- [x] **Title Updates** (Line ~157) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `titulo`
  - User Action: Inline title editing in modal
  
- [x] **Description Updates** (Line ~165) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `descricao`
  - User Action: Inline description editing in modal
  
- [x] **Solution Updates** (Line ~173) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `solucaoProposta`
  - User Action: Inline solution editing in modal
  
- [x] **Status Changes** (Modal body) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `statusId`
  - User Action: Status selector in modal
  
- [x] **Assignee Changes** (Modal body) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `colaboradorId`
  - User Action: Employee selector in modal
  
- [x] **Priority Changes** (Modal body) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `prioridade`
  - User Action: Priority dropdown in modal
  
- [x] **Due Date Changes** (Modal body) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `prazo`
  - User Action: Date picker in modal
  
- [x] **Estimated Hours Changes** (Modal body) - ✅ VERIFIED
  - ✅ Correct: Only sends changed `estimativaHoras`
  - User Action: Hours input in modal

**Total Inline Updates in TarefaViewModal: 8 different field updates**
**Implementation Status: ✅ VERIFIED - Follows PATCH best practices perfectly!**

---

### 3. Task List Components

#### ✅ `src/features/caso/component/CasoTaskList.tsx` - COMPLETED ✅

- [x] **Inline Title Editing** (Line ~138-150) - ✅ IMPLEMENTED
  - ✅ Implemented: Now uses `tarefaService.updateTarefa()` with PATCH
  - ✅ Sends only the `titulo` field: `{ titulo: editedTitle.trim() }`
  - ✅ Has proper error handling with rollback via `fetchData()`
  - Location: `handleSaveEdit` function
  - Removed TODO comment and implemented full server-side updates
  - **PATCH implementation complete!**

- [ ] **Quick Status Changes** (Line ~110-126) - NOT NEEDED
  - Current: Uses `moveTarefa` to change status
  - Note: `moveTarefa` is appropriate for this use case as it handles ordering
  - No changes needed here
  - User Action: Status dropdown in task list row

---

### 4. Task Board Component

#### ✅ `src/features/caso/component/CasoTaskBoard.tsx`

- [ ] **Consider PATCH for Non-Position Updates**
  - Current: Uses specialized endpoints (`moveTarefa`, `reorderTarefa`)
  - Note: Keep using specialized endpoints for drag-and-drop operations
  - Recommendation: Continue using existing endpoints for board operations
  - Reason: These operations involve complex state changes (order, status)
  
**Note**: CasoTaskBoard should continue using its specialized endpoints for DnD operations, but any inline editing features added in the future should use PATCH.

---

### 5. Quick Actions & Bulk Operations (Future Considerations)

#### 🔮 Potential Future Features

These features don't currently exist but would benefit from PATCH when implemented:

- [ ] **Quick Priority Toggle**
  - Feature: Single-click priority cycling (Low → Medium → High → Urgent)
  - Implementation: PATCH `{ prioridade: nextPriority }`
  
- [ ] **Quick Assignee Change**
  - Feature: Right-click context menu to reassign
  - Implementation: PATCH `{ colaboradorId: newId }`
  
- [ ] **Inline Date Quick-Edit**
  - Feature: Calendar picker popup in task cards
  - Implementation: PATCH `{ prazo: newDate }`
  
- [ ] **Keyboard Shortcuts**
  - Feature: Hotkeys for common updates (e.g., `P` for priority, `A` for assignee)
  - Implementation: PATCH with single field updates

---

## Implementation Priority

### 🚨 High Priority (Immediate Impact)
1. **tarefaService.ts** - Core service used by all components
2. **TarefaView.tsx** - Main task detail page with 8 inline edit operations
3. **TarefaViewModal.tsx** - Modal version with 8 inline edit operations

### 🟡 Medium Priority (Incremental Improvement)
4. **CasoTaskList.tsx** - Enable proper inline title editing (currently disabled)

### 🟢 Low Priority (Future Enhancement)
5. **Quick Actions & Bulk Operations** - Implement when features are added

---

## Migration Steps

### Step 1: Update Service Layer
```typescript
// File: src/features/caso/api/tarefaService.ts
// Change line 40 from:
const response = await apiClient.put(`/office-group/${groupId}/tarefas/${tarefaId}`, data);
// To:
const response = await apiClient.patch(`/office-group/${groupId}/tarefas/${tarefaId}`, data);
```

### Step 2: Test All Update Operations
After changing the service, test all components that call `updateTarefa`:
- [ ] Test title updates in TarefaView
- [ ] Test description updates in TarefaView
- [ ] Test solution updates in TarefaView
- [ ] Test status changes in TarefaView
- [ ] Test assignee changes in TarefaView
- [ ] Test priority changes in TarefaView
- [ ] Test due date changes in TarefaView
- [ ] Test estimated hours changes in TarefaView
- [ ] Test all same operations in TarefaViewModal
- [ ] Test status changes in CasoTaskList

### Step 3: Enable Previously Disabled Features
```typescript
// File: src/features/caso/component/CasoTaskList.tsx
// In handleSaveEdit function (line ~138)
// Replace the TODO with actual API call:

const handleSaveEdit = async (taskId: string) => {
  if (!groupId || !editedTitle.trim()) return;

  try {
    // ✅ CORRECT: Only sending the field that changed
    await tarefaService.updateTarefa(groupId, taskId, {
      titulo: editedTitle.trim()  // ONLY the titulo field!
    });
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, titulo: editedTitle } : task
      )
    );
    toast.success('Título atualizado com sucesso');
    setEditingTaskId(null);
  } catch (error: any) {
    console.error('Error updating title:', error);
    const errorMessage = error.response?.data?.message || 'Erro ao atualizar título';
    toast.error(errorMessage);
    // Reload to revert
    fetchData();
  }
};
```

**⚠️ CRITICAL**: Notice we only send `{ titulo: editedTitle.trim() }` - NOT the entire task object!

### Step 4: Monitor and Verify
- [ ] Check network tab to verify PATCH requests are being sent
- [ ] **CRITICAL**: Verify ONLY changed fields are in request payload (not the entire object!)
- [ ] Confirm payload size is minimal (should be ~50-200 bytes for single field updates)
- [ ] Confirm all optimistic UI updates work correctly
- [ ] Ensure rollback on errors still functions properly
- [ ] Check that no unnecessary fields (like `id`, `ordem`, etc.) are being sent

---

## Technical Notes

### Request Payload Examples

**Before (PUT):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "statusId": "abc-def-ghi",
  "colaboradorId": "xyz-123-456",
  "titulo": "Updated Title",
  "descricao": "Long description...",
  "solucaoProposta": "Solution text...",
  "ordem": 5,
  "prazo": "2026-02-15",
  "estimativaHoras": 8,
  "prioridade": "ALTA"
}
```

**After (PATCH):**
```json
{
  "titulo": "Updated Title"
}
```

### Error Handling
The current error handling pattern in all components is already compatible with PATCH:
1. Optimistic update (immediate UI feedback)
2. API call with partial data
3. Success: Update confirmed
4. Error: Rollback to original state

This pattern works even better with PATCH because rollbacks are simpler when only specific fields are changed.

### API Compatibility
According to the OpenAPI spec (line 148-176), the PATCH endpoint:
- Accepts the same `TarefaResource` schema as PUT
- Returns the complete `TarefaResource` after update
- Supports partial updates (all fields optional)

---

## Expected Outcomes

### Performance Improvements
- **Reduced payload size**: ~80-90% reduction for single-field updates
  - Before: ~500-1000 bytes (entire task object)
  - After: ~50-150 bytes (single field)
- **Faster network transfer**: Especially beneficial for mobile users
- **Better backend performance**: Less data validation and processing
- **Lower bandwidth costs**: Especially important for high-traffic scenarios

### Code Quality Improvements
- **Semantic correctness**: Using the right HTTP method for partial updates
- **Clearer intent**: Code explicitly shows which fields are being updated
- **Better maintainability**: Easier to understand update operations

### User Experience Improvements
- **Faster updates**: Smaller payloads = quicker responses
- **More reliable optimistic updates**: Easier to implement and rollback
- **Reduced conflicts**: Less chance of overwriting concurrent changes

---

## Completion Checklist

- [x] Update `tarefaService.updateTarefa` to use PATCH ✅
- [x] Test all 8 update operations in TarefaView.tsx ✅ (Verified implementation)
- [x] Test all 8 update operations in TarefaViewModal.tsx ✅ (Verified implementation)
- [x] Enable and test inline title editing in CasoTaskList.tsx ✅ (Implemented)
- [ ] **CRITICAL**: Verify network requests show PATCH method (Requires runtime testing)
- [ ] **CRITICAL**: Verify ONLY changed fields are in payloads (Requires runtime testing)
- [ ] **CRITICAL**: Verify reduced payload sizes (~50-200 bytes per request) (Requires runtime testing)
- [x] Confirm all error handling works correctly ✅ (Code review verified)
- [x] Ensure no component is accidentally sending entire task objects ✅ (Code review verified)
- [x] Update any related documentation ✅ (This document updated)
- [ ] Consider adding telemetry to measure performance gains (Future enhancement)
- [ ] Plan for future quick-action features using PATCH (Future enhancement)

---

## Questions & Considerations

### Should we keep both PUT and PATCH?
**Recommendation**: Keep only PATCH for `updateTarefa`
- PUT should be used for full resource replacement
- PATCH is more appropriate for the partial updates we're doing
- Current usage already treats it as a PATCH (using `Partial<TarefaResource>`)

### Should we add a separate method for full updates?
**Recommendation**: Not necessary
- All current use cases are partial updates
- If full replacement is needed in the future, can add `replaceTarefa` using PUT

### Should we batch multiple field updates?
**Recommendation**: Current approach is fine
- Each user action updates one field at a time
- Multiple simultaneous updates are unlikely
- If batching is needed later, PATCH already supports it

---

## Related Files

### Files to Modify
- `src/features/caso/api/tarefaService.ts` (service layer)
- `src/features/caso/component/TarefaView.tsx` (main detail view)
- `src/features/caso/component/TarefaViewModal.tsx` (modal detail view)
- `src/features/caso/component/CasoTaskList.tsx` (list view)

### Files to Test
- All files listed above
- Any custom hooks that might call `updateTarefa`
- Integration tests for task updates

### Documentation to Update
- API integration documentation
- Component documentation
- User guides (if any mention task editing behavior)

---

## Timeline Estimate

- **Service Layer Update**: 15 minutes
- **Testing All Components**: 1-2 hours
- **Enable Disabled Features**: 30 minutes
- **Documentation Updates**: 30 minutes
- **Total Estimated Time**: 3-4 hours

---

## Notes

- This migration is **backward compatible** - no breaking changes to component interfaces
- ✅ **EXCELLENT NEWS**: All components already use `Partial<TarefaResource>` and send only changed fields!
- ✅ **Components already follow PATCH best practices** - they never send entire objects
- The API spec confirms PATCH is supported and uses the same schema
- This is a **low-risk, high-value** improvement
- **The main change is just switching from PUT to PATCH in the service layer**
- Consider adding analytics to measure performance improvements before/after

### Current Implementation Analysis ✅

After reviewing the codebase:
- ✅ `TarefaView.tsx` - All handlers send single fields only
- ✅ `TarefaViewModal.tsx` - All handlers send single fields only
- ✅ No component is sending unnecessary data
- ✅ Pattern: `handleUpdate({ fieldName: newValue })` is used throughout
- ⚠️ Only `tarefaService.ts` needs to change from PUT to PATCH

---

*Document created: January 21, 2026*
*Last updated: January 21, 2026*
*Status: ✅ IMPLEMENTATION COMPLETE - Ready for runtime testing*

## Implementation Summary (January 21, 2026)

### ✅ Completed Changes:
1. **tarefaService.ts** - Changed from PUT to PATCH (Line 40)
2. **TarefaView.tsx** - Verified all 8 inline edit operations follow PATCH best practices
3. **TarefaViewModal.tsx** - Verified all 8 inline edit operations follow PATCH best practices  
4. **CasoTaskList.tsx** - Implemented inline title editing with PATCH endpoint

### 🧪 Remaining Testing:
- Runtime verification of PATCH requests in Network tab
- Payload size measurements
- End-to-end user testing of all update operations

### 📈 Expected Benefits:
- 80-90% reduction in payload sizes
- Semantic HTTP correctness (PATCH for partial updates)
- Better error handling and rollback capabilities
- Ready for future quick-action features
