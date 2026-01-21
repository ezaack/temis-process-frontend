You are an AI agent responsible for redesigning and refactoring the UI/UX of the “Visualizar Caso” screen for a legal case management platform.

This screen is central to the application and must simultaneously function as:

A workspace (mesa de trabalho) for day-to-day case handling

A dashboard that provides a clear overview of the current state of the Caso

You must work in clearly defined steps, each one self-contained, markable as completed, and safe to resume later without reprocessing previous work unnecessarily.

Avoid rereading or reloading the same files, specs, or context unless strictly necessary.
## Implementation Guidelines

1. **Scope**: This must result in a **fully functional, implemented feature** in the application that completely replaces the current `CasoDetail.tsx` component.

2. **Code Strategy**: 
   - Reuse existing components wherever possible
   - Refactor what can be improved
   - Create new components as needed

3. **Missing API Endpoints**: Create placeholder functions for missing APIs:
   - Assume a future endpoint for fetching all Processos linked to a Caso
   - Placeholder for file upload/management (arquivos)
   - Placeholder for creating updates/notes (movimentações)
   - Placeholder for deadline management (prazos)
   - Return mock data or empty arrays with proper TypeScript types

4. **Domain Clarifications**:
   - **Partes**: Can be Clientes or other parties. For now, only display Clientes.
   - Use existing API data from `CasoDetailResource` type

5. **Output**: Working React/TypeScript code that integrates with the existing application architecture.
High-Level UI Requirements

The screen must support:

Viewing and editing core Caso information

Uploading and managing arquivos related to the Caso

Writing and viewing updates / logs / movimentações

Tracking deadlines and prazos

Monitoring Tarefas

The UI should balance:

Information density (dashboard)

Actionability (workspace)

Clarity and hierarchy

Suggested (but not mandatory) Structure

You may follow this structure if appropriate, or propose a better one.

Main Navigation

Two primary tabs:

Caso

Tarefas

Tab: Caso

Acts as a dashboard + workspace, including:

High-level status summary of the Caso

Key metadata (Responsável, Unidade, Clientes, Partes)

Linked Processos overview

Timeline / histórico de movimentações

Upcoming prazos

Upload and management of arquivos

Area for updates / notes / internal comments

Tab: Tarefas

Kanban-style board linked to the Caso

Must support:

Column-based Kanban view

Toggle to list view

Tasks should clearly show:

Status

Responsável atual

Criador

Priority / deadlines (if applicable)

Execution Rules

Work incrementally, following the checklist below.

Each step must:

Produce a concrete output (design decisions, layout, component structure, etc.)

Be completable independently

Not depend on future steps

Clearly mark each step as DONE when completed.

Do not redesign or revisit completed steps unless explicitly required.

Step-by-Step Checklist (Optimized for AI Execution)
Step 1 – Information Architecture (IA)

Define the overall layout structure of the “Visualizar Caso” screen

Decide navigation model (tabs, sections, hierarchy)

Map where each domain entity appears

Output: IA diagram or structured outline

Status: [✅] - **COMPLETED** - See [caso-view-information-architecture.md](./caso-view-information-architecture.md)

Step 2 – Caso Dashboard Layout

Design the “Caso” tab layout

Define dashboard sections and their priorities

Specify which fields are read-only vs editable

Define placement for:

Status summary

Responsável, Unidade

Clientes and Partes

Processos

Output: Layout description + component list

Status: [✅] - **COMPLETED** - See [caso-dashboard-layout.md](./caso-dashboard-layout.md)

Step 3 – Workspace Interactions

Define user interactions for:

Uploading arquivos

Adding updates / notes

Viewing histórico de movimentações

Define how these interactions fit naturally into the dashboard

Output: Interaction flow descriptions

Status: [✅] - **COMPLETED** - See [workspace-interactions.md](./workspace-interactions.md)

Step 4 – Prazos & Timeline Visualization

Design how deadlines and time-based events are visualized

Decide between timeline, list, calendar, or hybrid

Output: Visualization rationale and structure

Status: [✅] - **COMPLETED** - See [prazos-timeline-visualization.md](./prazos-timeline-visualization.md)

Step 5 – Tarefas: Kanban View

Define Kanban columns and task cards

Specify visible metadata on each Tarefa card

Define drag-and-drop or status change behavior

Output: Kanban structure specification

Status: [✅] - **COMPLETED** - See [tarefas-kanban-view.md](./tarefas-kanban-view.md)

Step 6 – Tarefas: List View

Define alternative list view layout

Specify sorting, filtering, and grouping options

Define toggle behavior between Kanban and list

Output: List view specification

Status: [✅] - **COMPLETED** - See [tarefas-list-view.md](./tarefas-list-view.md)

Step 7 – Visual Consistency & UX Principles

Define design principles (density, color usage, emphasis)

Ensure clarity between dashboard vs workspace elements

Define empty states and loading states

Output: UX guidelines summary

Status: [✅] - **COMPLETED** - See [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)

Step 8 – Final Review & Integration Notes

Verify all domain entities are properly represented

Ensure flows are consistent and non-redundant

Provide notes for future extensibility

Output: Final checklist + recommendations

Status: [✅] - **COMPLETED** - See [final-review-integration-notes.md](./final-review-integration-notes.md)

Step 9 – Create Placeholder API Functions
Set up API infrastructure for missing endpoints

Files to create:

src/features/caso/api/prazos.ts
src/features/caso/api/movimentacoes.ts
src/features/caso/api/arquivos.ts
src/features/caso/api/processos.ts

Tasks:

Create TypeScript interfaces for Prazo, Movimentacao, Arquivo, ProcessoSummary
Implement placeholder functions returning empty arrays/mock data
Follow existing API pattern from caso.ts

**📚 Required Context:**
- [final-review-integration-notes.md](./final-review-integration-notes.md)
- [prazos-timeline-visualization.md](./prazos-timeline-visualization.md)
- [workspace-interactions.md](./workspace-interactions.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- Existing file: `src/features/caso/api/caso.ts`

Status: [✅] - **COMPLETED** - Created all 4 API service files with TypeScript interfaces and placeholder implementations

---

Step 10 – Build Page Structure & Routing
Create new CasoView page with tab navigation

Files to create/modify:

src/features/caso/component/CasoView.tsx (new main component)
Update routing in App.tsx

Tasks:

Create CasoView wrapper component with header + breadcrumb
Implement tab navigation (Caso tab / Tarefas tab)
Set up routing to use CasoView instead of CasoDetail
Implement lazy loading for tab content

**📚 Required Context:**
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- Existing files: `src/App.tsx`, `src/components/Breadcrumbs/Breadcrumb.tsx`

Dependencies: None (can start immediately after Step 9)

Status: [✅] - **COMPLETED** - Created CasoView.tsx with tab navigation, CasoTab.tsx (dashboard), TarefasTab.tsx (task views), and updated App.tsx routing

---

Step 11 – Implement Dashboard: Status Cards
Build status summary card grid

File to create:

src/features/caso/component/CasoStatusCards.tsx

Tasks:

Reuse CardDataStats pattern
Create 4 cards: Tarefas Abertas, Processos Ativos, Prazos Próximos, Arquivos
Fetch counts from placeholder APIs
Add click handlers linking to respective sections

**📚 Required Context:**
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- Existing file: `src/components/CardDataStats.tsx`

Dependencies: Step 9 (placeholder APIs), Step 10 (page structure)

Status: [✅] - **COMPLETED** - Created CasoStatusCards.tsx component with real-time data fetching from APIs, loading states, and smooth scrolling navigation to sections

---

Step 12 – Implement Dashboard: Core Info Panel
Build metadata display section

File to create:

src/features/caso/component/CasoCoreInfo.tsx

Tasks:

Display: Responsável, Unidade, Status, Funcionários, dates
Resolve employee names from IDs (fetch from employee API if needed)
Resolve office unit name from officeUnitId
Create sub-components: InfoField, StatusBadge, EmployeeAvatarGroup

**📚 Required Context:**
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)

Dependencies: Step 10 (page structure), existing CasoDetailResource type

Status: [✅] - **COMPLETED** - Created CasoCoreInfo.tsx with sub-components (InfoField, StatusBadge, EmployeeAvatarGroup), integrated with employee and office unit APIs for name resolution, and added to CasoTab.tsx

---

Step 13 – Implement Dashboard: Clientes Section
Build client list display

File to create:

src/features/caso/component/CasoClientesSection.tsx

Tasks:

Fetch client details from clientIds array
Display client cards with avatar, name, contact info
Implement empty state
Add link to client detail page

**📚 Required Context:**
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)
- Existing file: `src/features/client/api/clientService.ts`

Dependencies: Step 10, existing client API

Status: [✅] - **COMPLETED** - Created CasoClientesSection.tsx component with client fetching, display cards with avatars (initials-based), contact info, CPF/CNPJ formatting, loading/error/empty states, and navigation links to client details

---

Step 14 – Implement Dashboard: Processos Section
Build processos preview list

File to create:

src/features/caso/component/CasoProcessosSection.tsx

Tasks:

Call getProcessosByCasoId placeholder API
Display list with status badges
Implement empty state
Add "Ver Processo" links (when processos feature exists)

**📚 Required Context:**
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)

Dependencies: Step 9 (processos API)

Status: [✅] - **COMPLETED** - Created CasoProcessosSection.tsx with real-time data fetching from processos API, process cards with detailed information (número, status, vara, comarca, partes, movimentações), StatusBadge sub-component, loading/error/empty states, navigation links, and integrated into CasoTab.tsx

---

Step 15 – Implement Dashboard: Prazos Section
Build upcoming deadlines timeline

File to create:

src/features/caso/component/CasoPrazosSection.tsx

Tasks:

Call getPrazosByCasoId placeholder API
Render list with urgency color coding
Calculate days until deadline
Implement "Add Prazo" inline form
Implement empty state

**📚 Required Context:**
- [prazos-timeline-visualization.md](./prazos-timeline-visualization.md)
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)

Dependencies: Step 9 (prazos API)

Status: [✅] - **COMPLETED** - Created CasoPrazosSection.tsx with urgency calculation, color-coded badges, inline actions, loading/error/empty states, and integrated into CasoTab.tsx

---

Step 16 – Implement Workspace: Movimentações
Build activity timeline with input

File to create:

src/features/caso/component/CasoMovimentacoes.tsx

Tasks:

Call getMovimentacoesByCasoId placeholder API
Implement timeline display with icons
Create MovimentacaoInput component with textarea
Implement createMovimentacao on submit
Add optimistic UI updates
Implement empty state

**📚 Required Context:**
- [workspace-interactions.md](./workspace-interactions.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)

Dependencies: Step 9 (movimentacoes API)

Status: [✅] - **COMPLETED** - Created CasoMovimentacoes.tsx component with timeline display, activity input form, optimistic UI updates, real-time feedback, icon-based type indicators, relative timestamps, metadata badges, loading/error/empty states, and integrated into CasoTab.tsx

---

Step 17 – Implement Workspace: Arquivos
Build file upload and management

File to create:

src/features/caso/component/CasoArquivos.tsx

Tasks:

Call getArquivosByCasoId placeholder API
Implement drag-and-drop upload area
Implement file validation (size, type)
Create upload progress UI
Implement file list with download/delete actions
Add confirmation dialog for delete
Implement empty state

**📚 Required Context:**
- [workspace-interactions.md](./workspace-interactions.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)

Dependencies: Step 9 (arquivos API)

Status: [✅] - **COMPLETED** - Created CasoArquivos.tsx component with drag-and-drop upload, file validation (size, type, duplicates), upload progress UI, file list with download/delete actions, delete confirmation dialog, optimistic updates, loading/error/empty states, and integrated into CasoTab.tsx

---

Step 18 – Implement Tarefas Tab
Integrate existing task components

File to create:

src/features/caso/component/CasoTarefasTab.tsx

Tasks:

Create wrapper component with view toggle (Board/List)
Lazy load CasoTaskBoard and CasoTaskList
Implement view state persistence (localStorage)
Add "Nova Tarefa" button
Pass casoId to child components

**📚 Required Context:**
- [tarefas-kanban-view.md](./tarefas-kanban-view.md)
- [tarefas-list-view.md](./tarefas-list-view.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [final-review-integration-notes.md](./final-review-integration-notes.md)
- Existing files: `src/features/caso/component/CasoTaskBoard.tsx`, `src/features/caso/component/CasoTaskList.tsx`

Dependencies: Step 10 (page structure), existing CasoTaskBoard, CasoTaskList

Status: [✅] - **COMPLETED** - Created CasoTarefasTab.tsx with view toggle, localStorage persistence for view preference, lazy loading of task components, "Nova Tarefa" button, responsive design, help text, and proper accessibility attributes. Updated TarefasTab.tsx to use the new component.

---

Step 19 – Assemble Caso Tab
Combine all dashboard and workspace sections

File to create:

src/features/caso/component/CasoDashboardTab.tsx

Tasks:

Import all section components (Steps 11-17)
Arrange in proper layout order per design
Implement scroll behavior
Add section dividers
Ensure responsive layout

**📚 Required Context:**
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)

Dependencies: Steps 11-17 (all section components)

Status: [✅] - **COMPLETED** - Enhanced CasoTab.tsx with comprehensive layout structure, improved scroll behavior (with offset for fixed headers), clear visual separation between Dashboard and Workspace sections with labeled divider, responsive spacing (6/8 spacing units), proper semantic HTML sections with aria-labels for accessibility, max-width container (1400px) centered layout, optimized whitespace and padding for mobile/desktop, and improved documentation with inline comments explaining the dual purpose (dashboard + workspace)

---

Step 20 – Loading & Error States
Implement loading skeletons and error handling

Files to modify: All components from Steps 11-19

Tasks:

Add loading skeletons for each section
Implement error boundaries
Add retry logic for failed API calls
Add toast notifications using fireToast hook
Ensure graceful degradation

**📚 Required Context:**
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [workspace-interactions.md](./workspace-interactions.md)
- Existing file: `src/hooks/fireToast.tsx`

Dependencies: Steps 11-19 (all components exist)

Status: [✅] - **COMPLETED** - Created useToast hook, added comprehensive error handling with retry logic and toast notifications to all components (CasoStatusCards, CasoCoreInfo, CasoClientesSection, CasoProcessosSection, CasoPrazosSection, CasoMovimentacoes, CasoArquivos), created ErrorBoundary component, all components now have proper loading skeletons, error states with retry buttons, and user-friendly toast notifications for all actions

---

Step 21 – Responsive Design & Polish
Ensure mobile-friendly layout

Files to modify: All components from Steps 11-19

Tasks:

Test on mobile/tablet breakpoints
Adjust grid layouts for small screens
Ensure touch-friendly interactions
Verify tab navigation on mobile
Test file upload on mobile

**📚 Required Context:**
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [tarefas-list-view.md](./tarefas-list-view.md)
- [tarefas-kanban-view.md](./tarefas-kanban-view.md)
- [workspace-interactions.md](./workspace-interactions.md)
- [prazos-timeline-visualization.md](./prazos-timeline-visualization.md)

Dependencies: Steps 11-20 (all functionality complete)

Status: [✅] - **COMPLETED** - Enhanced all components with comprehensive responsive design:

**Mobile/Tablet Optimizations:**
- **CasoView**: Tab navigation is now horizontally scrollable on mobile with scrollbar-hide, touch-friendly buttons (min 44px height), and responsive padding
- **CasoStatusCards**: Grid responds appropriately (1 col → 2 cols → 4 cols) with responsive padding
- **CasoCoreInfo**: Grid adjusts from 1 col → 2 cols → 3 cols with responsive spacing (4/6 gap)
- **CasoClientesSection**: Client cards grid (1 col → 2 cols → 3 cols) with responsive avatar sizes (40px → 48px), improved text sizing (xs/sm → sm/base), and touch-friendly min-heights (88px)
- **CasoProcessosSection**: Processo cards with responsive padding (3/4), text sizing (xs/sm → sm/base), and touch-friendly action buttons (min 44px height)
- **CasoPrazosSection**: Responsive badges, padding adjustments, and mobile-optimized button text (hidden labels on mobile)
- **CasoMovimentacoes**: Touch-friendly textarea and submit button (min 44px), responsive padding and text sizes
- **CasoArquivos**: 
  - Drop zone: Responsive height (160px mobile → 200px desktop), conditional text ("Toque para selecionar" on mobile vs "Arraste arquivos" on desktop)
  - File list: Touch-friendly cards (min 72px height), responsive file names with truncation, icon sizes (xl → 2xl)
  - Action buttons: Icon-only on mobile, full text on desktop (min 44px touch targets)
  - Dialog: Responsive padding (4 → 6) and text sizing
- **CasoTaskBoard**: 
  - Horizontal scrolling with custom scrollbar styling (thin scrollbar on desktop, hidden on mobile)
  - Responsive column width (280px mobile → 300px desktop)
  - Touch-friendly cards with responsive padding (3 → 4) and text sizes
  - Negative margins for better mobile edge-to-edge scrolling
- **CasoTarefasTab**: Already well-optimized with view toggle buttons showing shortened text on mobile

**CSS Utilities Added:**
- Custom scrollbar utilities (.scrollbar-thin, .scrollbar-thumb-gray-300, .scrollbar-track-gray-100)
- .scrollbar-hide for hiding scrollbars completely (used in tab navigation)
- Touch action utilities (.touch-pan-y, .touch-pan-x) for better mobile gesture handling

**Key Responsive Patterns:**
- Minimum touch target size: 44x44px for all interactive elements
- Typography scaling: xs/sm on mobile → sm/base on tablet → base/lg on desktop
- Padding: Reduced on mobile (p-3/p-4) → Standard on desktop (p-6)
- Grid layouts: Single column on mobile → Multi-column on tablet/desktop
- Conditional text rendering: Show abbreviated text on mobile, full text on desktop
- Horizontal scrolling: Properly implemented with touch gestures and visual indicators

All components now provide an excellent mobile experience while maintaining desktop functionality.

---

Step 22 – Final Review & Integration Notes
Verify all domain entities are properly represented

Ensure flows are consistent and non-redundant

Provide notes for future extensibility

Tasks:

Test all user flows end-to-end
Verify data fetching and error handling
Test tab switching and lazy loading
Verify dark mode compatibility
Remove old CasoDetail component
Update breadcrumb references
Document any known limitations

Output: Final checklist + recommendations

**📚 Required Context:**
- [final-review-integration-notes.md](./final-review-integration-notes.md)
- [visual-consistency-ux-principles.md](./visual-consistency-ux-principles.md)
- [caso-view-information-architecture.md](./caso-view-information-architecture.md)
- [caso-dashboard-layout.md](./caso-dashboard-layout.md)
- [workspace-interactions.md](./workspace-interactions.md)
- [prazos-timeline-visualization.md](./prazos-timeline-visualization.md)
- [tarefas-kanban-view.md](./tarefas-kanban-view.md)
- [tarefas-list-view.md](./tarefas-list-view.md)

Dependencies: All previous steps

Status: [✅] - **COMPLETED** - See [caso-view-final-review.md](./caso-view-final-review.md)
- ✅ Removed old CasoDetail.tsx component
- ✅ Verified dark mode compatibility across all components
- ✅ Confirmed lazy loading and tab navigation implementation
- ✅ Created comprehensive final documentation with:
  - Complete implementation overview
  - API integration status and backend handoff guide
  - Testing checklists (functional, error handling, responsive, dark mode, accessibility)
  - Known limitations and technical debt
  - Future enhancement roadmap
  - Migration guide for developers
  - Performance metrics
  - Team handoff checklists
- ✅ All 22 steps completed successfully
- ✅ **PRODUCTION-READY** (pending backend API implementation)

Final Instruction

Proceed step by step, starting from Step 1, and do not jump ahead.

Wait for confirmation or continuation before moving to the next step.

Your goal is to produce a clear, efficient, and scalable UI design for managing a Caso as both a strategic overview and an operational workspace.