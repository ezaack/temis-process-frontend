# Information Architecture: Visualizar Caso Screen

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 1 of 8

---

## Overview

This document defines the Information Architecture (IA) for the redesigned "Visualizar Caso" screen. The screen serves as both a **dashboard** (strategic overview) and **workspace** (operational hub) for managing legal cases.

---

## 1. Layout Structure

### Primary Layout Pattern: **Tabbed Navigation**

The screen uses a **two-tab layout** to separate concerns while maintaining context:

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Caso Title + Breadcrumb + Edit Button                  │
├─────────────────────────────────────────────────────────────────┤
│  📊 Caso Tab  |  ✓ Tarefas Tab                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Tab-Specific Content]                                          │
│                                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Rationale
- **Separation of Concerns**: Case overview (Caso) vs. task management (Tarefas)
- **Reduced Cognitive Load**: Users can focus on one aspect at a time
- **Scalability**: Easy to add future tabs (e.g., Processos, Prazos, Arquivos)
- **Performance**: Lazy-load tab content to improve initial page load

---

## 2. Navigation Model

### Top-Level Navigation
1. **Caso Tab** (Default) - Dashboard + Workspace
2. **Tarefas Tab** - Task Management (Kanban + List views)

### Future Extensibility
Additional tabs can be added as the platform evolves:
- **Processos** - Linked legal processes
- **Prazos** - Deadline management
- **Arquivos** - Document repository
- **Movimentações** - Activity timeline

### Navigation Hierarchy
```
Dashboard → Casos → [Caso Detail]
                    ├── Caso Tab (default)
                    └── Tarefas Tab
                        ├── Board View (default)
                        └── List View
```

---

## 3. Domain Entity Mapping

### 3.1 Caso Tab - Entity Placement

| Entity | Section | Priority | Display Type | Editable |
|--------|---------|----------|--------------|----------|
| **Core Metadata** |
| Título | Header | Critical | H1 | Via Edit |
| Descrição | Dashboard | High | Text block | Via Edit |
| Status | Dashboard Summary | High | Badge | Read-only |
| ID | Dashboard Summary | Medium | Small text | Read-only |
| Data de Criação | Dashboard Summary | Low | Small text | Read-only |
| Criado Por | Dashboard Summary | Low | Small text | Read-only |
| Última Atualização | Dashboard Summary | Low | Small text | Read-only |
| **People & Organization** |
| Responsável | Dashboard | High | Card/Badge | Via Edit |
| Funcionários (Employees) | Dashboard | High | List/Cards | Via Edit |
| Unidade (OfficeUnit) | Dashboard | High | Badge/Card | Via Edit |
| Clientes | Dashboard | Critical | List/Cards | Via Edit |
| Partes (outras) | Dashboard | Medium | List/Cards (future) | Via Edit |
| **Linked Entities** |
| Processos | Dashboard | High | List/Preview | Link to detail |
| Prazos | Dashboard | High | Timeline/List | Add/Edit inline |
| Tarefas (summary) | Dashboard | Medium | Count/Link | Link to tab |
| **Activity & Documents** |
| Movimentações | Workspace | High | Timeline | Add inline |
| Arquivos | Workspace | High | Upload area | Add/Remove |
| Notas Internas | Workspace | Medium | Input area | Add inline |

### 3.2 Tarefas Tab - Entity Placement

| Entity | Section | Priority | Display Type |
|--------|---------|----------|--------------|
| Tarefas | Primary Content | Critical | Kanban/List |
| Status (Tarefa) | Card | High | Column/Badge |
| Responsável | Card | High | Avatar/Name |
| Criador | Card | Medium | Small text |
| Título | Card | Critical | Card header |
| Descrição | Card detail | Medium | Text (truncated) |
| Prioridade | Card | High | Badge/Color |
| Prazo | Card | High | Date + urgency |
| Estimativa Horas | Card | Low | Time badge |

---

## 4. Caso Tab Structure (Detailed)

### 4.1 Dashboard Section (Top Half)

**Purpose**: Strategic overview - "What's the state of this case?"

```
┌─────────────────────────────────────────────────────────────────┐
│ 📊 STATUS SUMMARY CARDS (3-4 cards)                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │ 5 Tarefas   │ │ 3 Processos │ │ 2 Prazos    │ │ 8 Arquivos  ││
│ │ em aberto   │ │ ativos      │ │ próximos    │ │ anexados    ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ 📋 CORE INFORMATION                                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Responsável: [Name]          Unidade: [Unit Name]          │ │
│ │ Criado em: [Date]            Atualizado: [Date]            │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 👥 CLIENTES & PARTES (cards with avatars/names)                 │
├─────────────────────────────────────────────────────────────────┤
│ 📑 PROCESSOS VINCULADOS (list with status)                      │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Processo #123-456 - Status: Em andamento → [Ver]         │   │
│ │ Processo #789-012 - Status: Aguardando citação → [Ver]   │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ ⏰ PRÓXIMOS PRAZOS (timeline or list)                            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Workspace Section (Bottom Half)

**Purpose**: Operational actions - "What can I do right now?"

```
┌─────────────────────────────────────────────────────────────────┐
│ 📝 MOVIMENTAÇÕES / HISTÓRICO                                     │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ [+ Nova Movimentação] input area                          │   │
│ ├───────────────────────────────────────────────────────────┤   │
│ │ Timeline:                                                 │   │
│ │ • 15/01/2026 - João: Petição inicial protocolada         │   │
│ │ • 10/01/2026 - Maria: Caso criado                        │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ 📎 ARQUIVOS                                                      │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ [+ Upload Arquivo] drag & drop area                      │   │
│ │                                                           │   │
│ │ Arquivos existentes:                                      │   │
│ │ • documento.pdf (2MB) - 10/01/2026 [Download] [Delete]   │   │
│ │ • contrato.docx (1.5MB) - 08/01/2026 [Download] [Delete] │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Tarefas Tab Structure (Detailed)

### 5.1 View Toggle

```
┌─────────────────────────────────────────────────────────────────┐
│ [+ Nova Tarefa]          [🎯 Board View] [📋 List View]         │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Board View (Kanban)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ A Fazer      │ Em Progresso │ Em Revisão   │ Concluído    │
│ (3)          │ (2)          │ (1)          │ (5)          │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │ Tarefa 1 │ │ │ Tarefa 4 │ │ │ Tarefa 7 │ │ │ Tarefa 8 │ │
│ │ [!] Alta │ │ │ [!] Alta │ │ │ [-] Baixa│ │ │          │ │
│ │ @João    │ │ │ @Maria   │ │ │ @Pedro   │ │ │          │ │
│ │ ⏰ 2 dias│ │ │ ⏰ 5 dias│ │ │          │ │ │          │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│ ┌──────────┐ │ ┌──────────┐ │              │              │
│ │ Tarefa 2 │ │ │ Tarefa 5 │ │              │              │
│ └──────────┘ │ └──────────┘ │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 5.3 List View

```
┌─────────────────────────────────────────────────────────────────┐
│ Filtros: [Status ▼] [Responsável ▼] [Prioridade ▼]             │
├──────┬─────────────────┬────────────┬───────────┬──────────────┤
│ ID   │ Título          │ Status     │ Resp.     │ Prazo        │
├──────┼─────────────────┼────────────┼───────────┼──────────────┤
│ #001 │ Analisar docs   │ A Fazer    │ João      │ 17/01/2026   │
│ #002 │ Revisar petição │ Em andamen │ Maria     │ 20/01/2026   │
│ #003 │ Protocolar      │ Em revisão │ Pedro     │ 15/01/2026   │
└──────┴─────────────────┴────────────┴───────────┴──────────────┘
```

---

## 6. Data Flow & API Integration

### Available Data (Current)
From `CasoDetailResource`:
- ✅ `id` (UUID)
- ✅ `titulo` (string)
- ✅ `descricao` (string)
- ✅ `officeUnitId` (UUID)
- ✅ `quadroTarefasId` (UUID)
- ✅ `employees` (CasoEmployeeResource[])
- ✅ `clientIds` (UUID[])
- ✅ `criadoEm` (datetime)
- ✅ `criadoPor` (string)
- ✅ `atualizadoEm` (datetime)
- ✅ `atualizadoPor` (string)

### Missing Data (Requires Placeholder APIs)
- ❌ Processos linked to Caso
- ❌ Prazos (deadlines)
- ❌ Movimentações (updates/logs)
- ❌ Arquivos (file attachments)
- ❌ Resolved Employee details (name, avatar from employeeId)
- ❌ Resolved Client details (name, info from clientId)
- ❌ Resolved OfficeUnit details (name from officeUnitId)

### Placeholder API Functions to Create

```typescript
// Processos
getProcessosByCasoId(casoId: string): Promise<ProcessoSummary[]>

// Prazos
getPrazosByCasoId(casoId: string): Promise<Prazo[]>
createPrazo(casoId: string, data: CreatePrazoRequest): Promise<Prazo>

// Movimentações
getMovimentacoesByCasoId(casoId: string): Promise<Movimentacao[]>
createMovimentacao(casoId: string, data: CreateMovimentacaoRequest): Promise<Movimentacao>

// Arquivos
getArquivosByCasoId(casoId: string): Promise<Arquivo[]>
uploadArquivo(casoId: string, file: File): Promise<Arquivo>
deleteArquivo(casoId: string, arquivoId: string): Promise<void>
```

---

## 7. Component Hierarchy

### New Component Structure

```
CasoViewPage/
├── CasoViewHeader                    (Breadcrumb, Title, Edit Button)
├── CasoViewTabs                      (Tab Navigation)
│   ├── CasoTab/
│   │   ├── CasoDashboard/
│   │   │   ├── CasoStatusCards       (Summary metrics)
│   │   │   ├── CasoCoreInfo          (Metadata panel)
│   │   │   ├── CasoClientesSection   (Clientes list)
│   │   │   ├── CasoProcessosSection  (Processos preview)
│   │   │   └── CasoPrazosSection     (Upcoming deadlines)
│   │   └── CasoWorkspace/
│   │       ├── CasoMovimentacoes     (Timeline + input)
│   │       └── CasoArquivos          (Upload + file list)
│   └── TarefasTab/
│       ├── TarefasViewToggle         (Board/List switcher)
│       ├── TarefasBoard              (Kanban - reuse existing)
│       └── TarefasList               (List view - reuse existing)
```

### Reusable Components from Codebase
- ✅ `CasoTaskBoard` - existing Kanban
- ✅ `CasoTaskList` - existing list view
- ✅ `CardDataStats` - for summary cards
- ✅ `PageTitle` / `Breadcrumb` - for header
- ✅ `ModalSettings` - for dialogs
- ✅ Forms components - for inputs

---

## 8. Interaction Patterns

### Dashboard Interactions (Read-heavy)
- **View Details**: Click entity cards to navigate (e.g., Client → Client detail page)
- **Quick Actions**: Inline actions like "Ver Processo", "Adicionar Prazo"
- **Edit Caso**: Global "Editar Caso" button in header → navigates to edit form

### Workspace Interactions (Write-heavy)
- **Add Movimentação**: Inline input + submit
- **Upload Arquivo**: Drag & drop or file picker
- **Delete Arquivo**: Inline delete button with confirmation

### Tarefas Interactions
- **Drag & Drop**: Move tasks between Kanban columns
- **Quick Edit**: Click task card to open modal/drawer
- **Create Task**: "Nova Tarefa" button → modal form
- **Toggle View**: Switch between Board/List with preserved state

---

## 9. State Management

### Component State
- `activeTab`: 'caso' | 'tarefas' (tab selection)
- `tarefasView`: 'board' | 'list' (Tarefas view mode)
- `caso`: CasoDetailResource (main data)
- `loading`: boolean (fetch state)
- `error`: string | null (error state)

### API State (per entity)
- `processos`: ProcessoSummary[] | null
- `prazos`: Prazo[] | null
- `movimentacoes`: Movimentacao[] | null
- `arquivos`: Arquivo[] | null
- `employees`: EmployeeDetail[] | null (resolved)
- `clients`: ClientDetail[] | null (resolved)
- `officeUnit`: OfficeUnitDetail | null (resolved)

### Lazy Loading Strategy
- Caso tab content: Load on mount
- Tarefas tab content: Load when tab is first activated
- Secondary data (processos, prazos, etc.): Load progressively

---

## 10. Accessibility & Responsive Design

### Accessibility
- Semantic HTML (nav, section, article)
- ARIA labels for tab navigation
- Keyboard navigation support (Tab, Arrow keys, Enter)
- Focus management when switching tabs
- Screen reader announcements for dynamic content

### Responsive Breakpoints
- **Mobile (< 640px)**: Single column, tabs as dropdown
- **Tablet (640px - 1024px)**: 2-column grid for dashboard cards
- **Desktop (> 1024px)**: Full layout as designed

---

## 11. Performance Considerations

### Code Splitting
- Lazy-load Tarefas tab components
- Lazy-load heavy libraries (drag-and-drop, file upload)

### Data Fetching
- Parallel requests for independent data (clients, employees, unit)
- Debounced search/filter inputs
- Paginated lists for large datasets (Movimentações, Arquivos)

### Caching
- Cache Caso data in context/state
- Invalidate cache on mutations (edit, create, delete)

---

## 12. Future Extensibility

### Planned Features (Not in Current Scope)
- **Processos Tab**: Dedicated view for linked processes
- **Prazos Tab**: Calendar view + deadline management
- **Arquivos Tab**: Document repository with search/filter
- **Relatórios**: Export case reports
- **Notificações**: Real-time updates via WebSocket
- **Comentários**: Threaded discussions per case
- **Audit Log**: Full history of changes

### Architecture Supports
- ✅ Adding new tabs (modular tab system)
- ✅ Adding new sections (component composition)
- ✅ Adding new APIs (placeholder pattern)
- ✅ Theme customization (uses Tailwind)

---

## Summary

This Information Architecture provides:

1. ✅ **Clear Layout Structure**: Two-tab system (Caso, Tarefas)
2. ✅ **Entity Mapping**: All domain entities have defined placement
3. ✅ **Navigation Model**: Tab-based with future extensibility
4. ✅ **Component Hierarchy**: Modular, reusable components
5. ✅ **Interaction Patterns**: Dashboard (read) vs Workspace (write)
6. ✅ **Data Flow**: Known APIs + placeholder strategy
7. ✅ **Scalability**: Room for growth without rearchitecture

**Next Step**: Proceed to **Step 2 - Caso Dashboard Layout**

---

**Completed**: ✅ January 15, 2026
