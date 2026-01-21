# Prazos & Timeline Visualization Design

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 4 of 8

---

## Overview

This document defines the visualization strategy for **Prazos** (deadlines) and time-based events in the "Visualizar Caso" screen. The design must balance:

1. **Urgency awareness** - Immediate identification of critical deadlines
2. **Information density** - Show enough detail without overwhelming
3. **Actionability** - Easy to add, edit, and respond to deadlines
4. **Context** - Integration with overall case timeline

---

## 1. Visualization Options Analysis

### Option A: Pure Timeline View

```
┌─────────────────────────────────────────────────────────────────┐
│  JAN 15 ━━●━━━━━━━━━━●━━━━━━━━━━━━━━━━●━━━━━━━━━━ FEB 15        │
│           ↑           ↑                ↑                          │
│         Hoje      Jan 20            Jan 30                        │
└─────────────────────────────────────────────────────────────────┘
```

**Pros**:
- Excellent temporal context
- Visual representation of time gaps
- Easy to see clustering of deadlines

**Cons**:
- Difficult to show detailed information
- Requires horizontal space
- Doesn't scale well with many deadlines
- Not ideal for mobile

### Option B: Pure Calendar View

```
┌─────────────────────────────────────────────────────────────────┐
│  JANEIRO 2026                                                    │
│  Dom  Seg  Ter  Qua  Qui  Sex  Sáb                              │
│        13   14  [15] 16   17   18                               │
│        19  [20] 21   22   23   24                               │
│        25   26   27   28   29  [30]                             │
└─────────────────────────────────────────────────────────────────┘
```

**Pros**:
- Familiar interface
- Good for planning
- Shows monthly context

**Cons**:
- Requires significant space
- Detail must be shown in popover/modal
- Overkill for simple deadline list
- Not focused on urgency

### Option C: List View with Urgency Indicators

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  URGENTE - Prazo vence em 1 dia                             │
│  📋 Apresentar recurso                                           │
│  16/01/2026 às 17:00 • Processo #123-456                        │
│                                                   [Editar] [Ação]│
├─────────────────────────────────────────────────────────────────┤
│  🔔 PRÓXIMO - Prazo vence em 5 dias                             │
│  📝 Manifestação judicial                                        │
│  20/01/2026 às 12:00 • Processo #789-012                        │
│                                                   [Editar] [Ação]│
├─────────────────────────────────────────────────────────────────┤
│  📅 Audiência marcada                                            │
│  30/01/2026 às 14:00 • Processo #345-678                        │
│                                                   [Editar] [Ação]│
└─────────────────────────────────────────────────────────────────┘
```

**Pros**:
- Clear information hierarchy
- Excellent for urgency display
- Scales well with many items
- Mobile-friendly
- Shows detailed information inline

**Cons**:
- Less visual temporal context
- May feel more utilitarian

### Option D: Hybrid (Timeline + List)

```
┌─────────────────────────────────────────────────────────────────┐
│  Timeline Overview:                                              │
│  HOJE ━●━━━●━━━━━━━●━━━━━━━━━━━→ PRÓXIMOS 30 DIAS               │
│       ↓    ↓       ↓                                             │
│       2    5      15 dias                                        │
├─────────────────────────────────────────────────────────────────┤
│  Próximos Prazos:                                                │
│  ⚠️  [Prazo 1 details]                                           │
│  🔔  [Prazo 2 details]                                           │
│  📅  [Prazo 3 details]                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Pros**:
- Best of both worlds
- Timeline provides context
- List provides detail and action

**Cons**:
- Takes more vertical space
- More complex implementation

---

## 2. Chosen Approach: **Hybrid List + Mini Timeline**

### Rationale

After analyzing the requirements and context:

1. **Primary Use Case**: Users need to quickly identify and act on urgent deadlines
2. **Dashboard Context**: Part of a larger dashboard with limited space
3. **Mobile Support**: Must work well on all screen sizes
4. **Actionability**: Need inline actions without navigation

**Decision**: Use a **list view with urgency indicators** as the primary visualization, with an optional **mini timeline header** for temporal context.

### Implementation Strategy

- **Default**: List view only (lightweight, action-focused)
- **Optional Enhancement**: Add collapsible mini timeline when > 3 deadlines
- **Responsive**: Timeline hidden on mobile, list remains

---

## 3. Detailed Design Specification

### 3.1 Component Structure

```typescript
interface Prazo {
  id: string;
  titulo: string;
  descricao?: string;
  data: string; // ISO datetime
  tipo: 'audiencia' | 'recurso' | 'manifestacao' | 'protocolo' | 'outro';
  processoId?: string; // Linked processo
  processoNumero?: string; // For display
  casoId: string;
  criadoPor: string;
  criadoEm: string;
  concluido: boolean;
  concluidoEm?: string;
  concluidoPor?: string;
}

interface PrazoUrgency {
  level: 'urgent' | 'soon' | 'upcoming' | 'future';
  daysUntil: number;
  hoursUntil: number;
  label: string;
  color: string;
  icon: string;
}
```

### 3.2 Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  {/* Header with title and actions */}
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black dark:text-white">
        ⏰ Próximos Prazos
      </h3>
      <div className="flex gap-3">
        <button className="btn-secondary">
          [Toggle Timeline]
        </button>
        <button className="btn-primary">
          + Adicionar Prazo
        </button>
      </div>
    </div>
  </div>

  {/* Optional: Mini Timeline (collapsible) */}
  {showTimeline && prazos.length > 3 && (
    <div className="border-b border-stroke px-6 py-4 bg-gray-50 dark:bg-meta-4">
      <MiniTimeline prazos={prazos} />
    </div>
  )}

  {/* Prazo List */}
  <div className="p-6">
    {prazos.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="space-y-4">
        {sortedPrazos.map(prazo => (
          <PrazoCard key={prazo.id} prazo={prazo} />
        ))}
      </div>
    )}
  </div>
</div>
```

### 3.3 Urgency Calculation

```typescript
function calculateUrgency(prazo: Prazo): PrazoUrgency {
  const now = new Date();
  const deadline = new Date(prazo.data);
  const msUntil = deadline.getTime() - now.getTime();
  const hoursUntil = Math.floor(msUntil / (1000 * 60 * 60));
  const daysUntil = Math.floor(hoursUntil / 24);

  if (daysUntil < 0) {
    return {
      level: 'urgent',
      daysUntil,
      hoursUntil,
      label: 'VENCIDO',
      color: 'red',
      icon: '🚨'
    };
  } else if (daysUntil === 0 && hoursUntil <= 24) {
    return {
      level: 'urgent',
      daysUntil,
      hoursUntil,
      label: `HOJE (${hoursUntil}h restantes)`,
      color: 'red',
      icon: '⚠️'
    };
  } else if (daysUntil === 1) {
    return {
      level: 'urgent',
      daysUntil,
      hoursUntil,
      label: 'AMANHÃ',
      color: 'orange',
      icon: '⚠️'
    };
  } else if (daysUntil <= 3) {
    return {
      level: 'soon',
      daysUntil,
      hoursUntil,
      label: `${daysUntil} dias`,
      color: 'orange',
      icon: '🔔'
    };
  } else if (daysUntil <= 7) {
    return {
      level: 'upcoming',
      daysUntil,
      hoursUntil,
      label: `${daysUntil} dias`,
      color: 'yellow',
      icon: '📅'
    };
  } else {
    return {
      level: 'future',
      daysUntil,
      hoursUntil,
      label: `${daysUntil} dias`,
      color: 'blue',
      icon: '📅'
    };
  }
}
```

### 3.4 Prazo Card Design

```tsx
function PrazoCard({ prazo, onEdit, onComplete }: PrazoCardProps) {
  const urgency = calculateUrgency(prazo);
  const tipoConfig = getTipoConfig(prazo.tipo);

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 bg-white p-4 shadow-sm",
        "dark:bg-boxdark hover:shadow-md transition-shadow",
        urgencyBorderColors[urgency.level]
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          {/* Urgency Badge */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold",
              urgencyBackgroundColors[urgency.level]
            )}
          >
            <span>{urgency.icon}</span>
            <span>{urgency.label}</span>
          </div>

          {/* Tipo Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-meta-4">
            <span>{tipoConfig.icon}</span>
            <span className="text-xs font-medium">{tipoConfig.label}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(prazo)}
            className="text-primary hover:text-primary-dark"
          >
            ✏️
          </button>
          {!prazo.concluido && (
            <button
              onClick={() => onComplete(prazo)}
              className="text-success hover:text-success-dark"
            >
              ✓
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-black dark:text-white mb-1">
        {tipoConfig.icon} {prazo.titulo}
      </h4>

      {/* Description (if present) */}
      {prazo.descricao && (
        <p className="text-sm text-bodydark mb-2 line-clamp-2">
          {prazo.descricao}
        </p>
      )}

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-bodydark">
        {/* Date/Time */}
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span>{formatDateTime(prazo.data)}</span>
        </div>

        {/* Linked Processo */}
        {prazo.processoNumero && (
          <div className="flex items-center gap-1">
            <span>📑</span>
            <a
              href={`/processos/${prazo.processoId}`}
              className="text-primary hover:underline"
            >
              {prazo.processoNumero}
            </a>
          </div>
        )}

        {/* Created by */}
        <div className="flex items-center gap-1">
          <span>👤</span>
          <span>{prazo.criadoPor}</span>
        </div>
      </div>

      {/* Completed Badge (if applicable) */}
      {prazo.concluido && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-success text-white text-xs">
          ✓ Concluído em {formatDate(prazo.concluidoEm!)}
        </div>
      )}
    </div>
  );
}
```

### 3.5 Tipo Configuration

```typescript
const tipoConfig = {
  audiencia: {
    label: 'Audiência',
    icon: '⚖️',
    color: 'purple'
  },
  recurso: {
    label: 'Recurso',
    icon: '📋',
    color: 'blue'
  },
  manifestacao: {
    label: 'Manifestação',
    icon: '📝',
    color: 'green'
  },
  protocolo: {
    label: 'Protocolo',
    icon: '📬',
    color: 'orange'
  },
  outro: {
    label: 'Outro',
    icon: '📌',
    color: 'gray'
  }
};

function getTipoConfig(tipo: Prazo['tipo']) {
  return tipoConfig[tipo] || tipoConfig.outro;
}
```

### 3.6 Urgency Color Mapping

```typescript
const urgencyBorderColors = {
  urgent: 'border-l-danger',
  soon: 'border-l-warning',
  upcoming: 'border-l-primary',
  future: 'border-l-bodydark2'
};

const urgencyBackgroundColors = {
  urgent: 'bg-danger text-white',
  soon: 'bg-warning text-black',
  upcoming: 'bg-primary/10 text-primary',
  future: 'bg-bodydark2/10 text-bodydark'
};

const urgencyTextColors = {
  urgent: 'text-danger',
  soon: 'text-warning',
  upcoming: 'text-primary',
  future: 'text-bodydark'
};
```

---

## 4. Mini Timeline Component (Optional Enhancement)

### 4.1 Purpose

Provide quick visual context of deadline distribution over the next 30 days.

### 4.2 Design

```tsx
function MiniTimeline({ prazos }: { prazos: Prazo[] }) {
  const next30Days = prazos.filter(p => {
    const days = calculateUrgency(p).daysUntil;
    return days >= 0 && days <= 30;
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-bodydark">
        <span>HOJE</span>
        <span>+30 DIAS</span>
      </div>

      {/* Timeline Bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-meta-4 rounded-full">
        {/* Today Marker */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black dark:bg-white" />

        {/* Deadline Markers */}
        {next30Days.map(prazo => {
          const urgency = calculateUrgency(prazo);
          const position = Math.min((urgency.daysUntil / 30) * 100, 100);

          return (
            <div
              key={prazo.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${position}%` }}
              title={`${prazo.titulo} - ${urgency.label}`}
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2 border-white",
                  `bg-${urgency.color}-500`
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Week Markers */}
      <div className="flex justify-between text-xs text-bodydark">
        <span>|</span>
        <span>7d</span>
        <span>14d</span>
        <span>21d</span>
        <span>|</span>
      </div>
    </div>
  );
}
```

### 4.3 Toggle Behavior

- **Default**: Hidden (saves space)
- **Show When**: User clicks "Ver Timeline" or when > 5 prazos
- **Persist**: Save preference in localStorage
- **Mobile**: Always hidden on mobile (<640px)

---

## 5. Sorting & Filtering

### 5.1 Default Sort Order

Prazos are sorted by:

1. **Status**: Vencidos → Hoje → Próximos → Futuros
2. **Date**: Earliest first within each status
3. **Urgency Level**: Urgent → Soon → Upcoming → Future

```typescript
function sortPrazos(prazos: Prazo[]): Prazo[] {
  return [...prazos].sort((a, b) => {
    const urgencyA = calculateUrgency(a);
    const urgencyB = calculateUrgency(b);

    // First: Sort by urgency level
    const urgencyOrder = { urgent: 0, soon: 1, upcoming: 2, future: 3 };
    const urgencyDiff = urgencyOrder[urgencyA.level] - urgencyOrder[urgencyB.level];
    if (urgencyDiff !== 0) return urgencyDiff;

    // Then: Sort by date (earliest first)
    return new Date(a.data).getTime() - new Date(b.data).getTime();
  });
}
```

### 5.2 Filter Options (Future Enhancement)

```tsx
interface PrazoFilters {
  tipo?: Prazo['tipo'][];
  urgency?: PrazoUrgency['level'][];
  processo?: string;
  concluido?: boolean;
}

function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <select
        value={filters.tipo}
        onChange={e => onFiltersChange({ ...filters, tipo: e.target.value })}
        className="select-input"
      >
        <option value="">Todos os tipos</option>
        <option value="audiencia">Audiências</option>
        <option value="recurso">Recursos</option>
        <option value="manifestacao">Manifestações</option>
        <option value="protocolo">Protocolos</option>
        <option value="outro">Outros</option>
      </select>

      <select
        value={filters.urgency}
        onChange={e => onFiltersChange({ ...filters, urgency: e.target.value })}
        className="select-input"
      >
        <option value="">Todas urgências</option>
        <option value="urgent">Urgentes</option>
        <option value="soon">Próximos</option>
        <option value="upcoming">Esta semana</option>
        <option value="future">Futuros</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.concluido}
          onChange={e => onFiltersChange({ ...filters, concluido: e.target.checked })}
        />
        <span>Mostrar concluídos</span>
      </label>
    </div>
  );
}
```

---

## 6. Interactions

### 6.1 Add Prazo

**Trigger**: Click "+ Adicionar Prazo" button

**Flow**:
```
Click Button → Open Modal/Drawer → Fill Form → Submit → Close & Refresh
```

**Form Fields**:
```tsx
interface CreatePrazoForm {
  titulo: string;           // Required
  descricao?: string;       // Optional
  data: Date;               // Required
  tipo: Prazo['tipo'];      // Required
  processoId?: string;      // Optional - Link to processo
}
```

**Modal Design**:
```tsx
<Modal title="Adicionar Prazo" onClose={onClose}>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      {/* Titulo */}
      <div>
        <label className="label">Título *</label>
        <input
          type="text"
          name="titulo"
          className="input"
          placeholder="Ex: Apresentar recurso de apelação"
          required
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="label">Tipo *</label>
        <select name="tipo" className="select" required>
          <option value="">Selecione...</option>
          <option value="audiencia">⚖️ Audiência</option>
          <option value="recurso">📋 Recurso</option>
          <option value="manifestacao">📝 Manifestação</option>
          <option value="protocolo">📬 Protocolo</option>
          <option value="outro">📌 Outro</option>
        </select>
      </div>

      {/* Data/Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Data *</label>
          <input type="date" name="data" className="input" required />
        </div>
        <div>
          <label className="label">Hora *</label>
          <input type="time" name="hora" className="input" required />
        </div>
      </div>

      {/* Processo (optional) */}
      <div>
        <label className="label">Vincular a Processo</label>
        <select name="processoId" className="select">
          <option value="">Nenhum</option>
          {processos.map(p => (
            <option key={p.id} value={p.id}>
              {p.numero} - {p.descricao}
            </option>
          ))}
        </select>
      </div>

      {/* Descricao */}
      <div>
        <label className="label">Descrição</label>
        <textarea
          name="descricao"
          className="textarea"
          rows={3}
          placeholder="Detalhes adicionais sobre o prazo..."
        />
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3 mt-6">
      <button type="button" onClick={onClose} className="btn-secondary">
        Cancelar
      </button>
      <button type="submit" className="btn-primary">
        Adicionar Prazo
      </button>
    </div>
  </form>
</Modal>
```

### 6.2 Edit Prazo

**Trigger**: Click ✏️ icon on prazo card

**Flow**: Same as Add, but pre-populate form with existing data

### 6.3 Complete Prazo

**Trigger**: Click ✓ icon on prazo card

**Flow**:
```
Click ✓ → Show Confirmation → Submit → Update UI → Show Toast
```

**Confirmation Dialog**:
```tsx
<ConfirmDialog
  title="Marcar prazo como concluído"
  message={`Confirma que o prazo "${prazo.titulo}" foi cumprido?`}
  onConfirm={() => completePrazo(prazo.id)}
  onCancel={onClose}
  confirmText="Sim, marcar como concluído"
  confirmColor="success"
/>
```

**Effect**:
- Set `concluido = true`
- Set `concluidoEm = now`
- Set `concluidoPor = currentUser`
- Move to bottom of list (or hide if filter active)
- Show green "Concluído" badge

### 6.4 View Processo Details

**Trigger**: Click processo link on prazo card

**Flow**: Navigate to `/processos/:processoId`

---

## 7. Empty State

```tsx
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📅</div>
      <h4 className="text-xl font-semibold text-black dark:text-white mb-2">
        Nenhum prazo cadastrado
      </h4>
      <p className="text-bodydark mb-6">
        Adicione prazos para acompanhar audiências, recursos e outras datas importantes.
      </p>
      <button className="btn-primary">
        + Adicionar Primeiro Prazo
      </button>
    </div>
  );
}
```

---

## 8. Loading State

```tsx
function PrazoCardSkeleton() {
  return (
    <div className="rounded-lg border-l-4 border-gray-200 bg-white p-4 shadow-sm dark:bg-boxdark animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-12 bg-gray-200 rounded" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
    </div>
  );
}

function PrazosLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <PrazoCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

---

## 9. Error State

```tsx
function PrazosError({ error, onRetry }: PrazosErrorProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">⚠️</div>
      <h4 className="text-xl font-semibold text-black dark:text-white mb-2">
        Erro ao carregar prazos
      </h4>
      <p className="text-bodydark mb-6">
        {error?.message || 'Ocorreu um erro ao buscar os prazos deste caso.'}
      </p>
      <button onClick={onRetry} className="btn-primary">
        Tentar Novamente
      </button>
    </div>
  );
}
```

---

## 10. Responsive Design

### Desktop (>1024px)
- Full layout as designed
- Show all information inline
- Optional mini timeline visible

### Tablet (640px - 1024px)
- Stack badges vertically if needed
- Reduce padding
- Hide mini timeline by default

### Mobile (<640px)
- Single column layout
- Larger touch targets (min 44x44px)
- Simplified meta information
- Always hide mini timeline
- Bottom sheet for Add/Edit modals

```tsx
// Responsive Badge Layout
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
  <UrgencyBadge />
  <TipoBadge />
</div>

// Responsive Meta Layout
<div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4">
  <DateInfo />
  <ProcessoLink />
  <CreatorInfo />
</div>
```

---

## 11. Accessibility

### Keyboard Navigation
- `Tab` - Navigate between prazo cards
- `Enter` - Open edit modal
- `Space` - Toggle completion
- `Escape` - Close modals

### ARIA Labels
```tsx
<div
  role="article"
  aria-label={`Prazo: ${prazo.titulo}, vence em ${urgency.label}`}
  tabIndex={0}
>
  {/* Card content */}
</div>

<button
  aria-label={`Editar prazo: ${prazo.titulo}`}
  onClick={onEdit}
>
  ✏️
</button>

<button
  aria-label={`Marcar prazo como concluído: ${prazo.titulo}`}
  onClick={onComplete}
>
  ✓
</button>
```

### Screen Reader Support
- Announce urgency level on focus
- Announce completion status changes
- Provide context for icon-only buttons

---

## 12. Performance Considerations

### Optimization Strategies

1. **Pagination**: Load only next 30 days by default
   - "Show More" button to load additional prazos
   - Lazy load past/completed prazos

2. **Virtual Scrolling**: If > 50 prazos (edge case)

3. **Memoization**: Cache urgency calculations
   ```tsx
   const urgency = useMemo(() => calculateUrgency(prazo), [prazo.data]);
   ```

4. **Debounced Updates**: When editing prazos

5. **Optimistic UI**: Update UI before API confirmation

---

## 13. Integration with Other Features

### Link to Tarefas
When a prazo is approaching, suggest creating a Tarefa:
```tsx
{urgency.level === 'urgent' && !prazo.tarefaId && (
  <button className="btn-sm btn-secondary mt-2">
    + Criar Tarefa para este Prazo
  </button>
)}
```

### Link to Processos
- Show processo context on prazo card
- Filter prazos by processo
- Navigate to processo detail

### Link to Arquivos
- Attach documents to prazos (future)
- Show attached files count on card

### Notifications (Future)
- Browser notifications for approaching deadlines
- Email reminders 24h/48h before
- In-app notification bell

---

## 14. Data Management

### API Placeholder

```typescript
// src/features/caso/api/prazos.ts

export interface Prazo {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  tipo: 'audiencia' | 'recurso' | 'manifestacao' | 'protocolo' | 'outro';
  processoId?: string;
  processoNumero?: string;
  casoId: string;
  criadoPor: string;
  criadoEm: string;
  concluido: boolean;
  concluidoEm?: string;
  concluidoPor?: string;
}

export interface CreatePrazoRequest {
  titulo: string;
  descricao?: string;
  data: string;
  tipo: Prazo['tipo'];
  processoId?: string;
}

export interface UpdatePrazoRequest extends Partial<CreatePrazoRequest> {}

// Placeholder implementation
export async function getPrazosByCasoId(casoId: string): Promise<Prazo[]> {
  // TODO: Replace with actual API call
  console.log('[PLACEHOLDER] Fetching prazos for caso:', casoId);
  return [];
}

export async function createPrazo(
  casoId: string,
  data: CreatePrazoRequest
): Promise<Prazo> {
  // TODO: Replace with actual API call
  console.log('[PLACEHOLDER] Creating prazo:', data);
  throw new Error('Not implemented');
}

export async function updatePrazo(
  casoId: string,
  prazoId: string,
  data: UpdatePrazoRequest
): Promise<Prazo> {
  // TODO: Replace with actual API call
  console.log('[PLACEHOLDER] Updating prazo:', prazoId, data);
  throw new Error('Not implemented');
}

export async function completePrazo(
  casoId: string,
  prazoId: string
): Promise<Prazo> {
  // TODO: Replace with actual API call
  console.log('[PLACEHOLDER] Completing prazo:', prazoId);
  throw new Error('Not implemented');
}

export async function deletePrazo(
  casoId: string,
  prazoId: string
): Promise<void> {
  // TODO: Replace with actual API call
  console.log('[PLACEHOLDER] Deleting prazo:', prazoId);
  throw new Error('Not implemented');
}
```

### State Management

```tsx
// In CasoPrazosSection component
const [prazos, setPrazos] = useState<Prazo[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
const [showTimeline, setShowTimeline] = useState(false);

useEffect(() => {
  async function loadPrazos() {
    try {
      setLoading(true);
      const data = await getPrazosByCasoId(casoId);
      setPrazos(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }
  loadPrazos();
}, [casoId]);

// Optimistic update for completion
async function handleComplete(prazo: Prazo) {
  const optimisticPrazo = {
    ...prazo,
    concluido: true,
    concluidoEm: new Date().toISOString(),
    concluidoPor: currentUser.name
  };

  // Update UI immediately
  setPrazos(prev =>
    prev.map(p => (p.id === prazo.id ? optimisticPrazo : p))
  );

  try {
    await completePrazo(casoId, prazo.id);
    fireToast('success', 'Prazo marcado como concluído');
  } catch (err) {
    // Rollback on error
    setPrazos(prev =>
      prev.map(p => (p.id === prazo.id ? prazo : p))
    );
    fireToast('error', 'Erro ao marcar prazo como concluído');
  }
}
```

---

## 15. Testing Considerations

### Test Cases

1. **Urgency Calculation**
   - Overdue deadline (past date)
   - Today deadline
   - Tomorrow deadline
   - 3 days deadline
   - 7 days deadline
   - Future deadline (>7 days)

2. **Sorting**
   - Mixed urgency levels
   - Same urgency, different dates
   - Completed vs pending

3. **Empty States**
   - No prazos
   - All prazos completed
   - Filtered to empty

4. **Loading States**
   - Initial load
   - Refresh after action

5. **Error States**
   - API failure
   - Network timeout
   - Invalid data

6. **Interactions**
   - Add prazo
   - Edit prazo
   - Complete prazo
   - Toggle timeline
   - Filter/sort

---

## Summary

### Design Decisions

✅ **Primary Visualization**: List view with urgency indicators  
✅ **Secondary Visualization**: Optional mini timeline (collapsible)  
✅ **Sorting**: By urgency level, then by date  
✅ **Urgency Levels**: 4 levels (urgent, soon, upcoming, future)  
✅ **Prazo Types**: 5 types (audiencia, recurso, manifestacao, protocolo, outro)  
✅ **Actions**: Add, Edit, Complete, View Processo  
✅ **Responsive**: Mobile-first, progressive enhancement  

### Why This Approach

1. **Urgency-Focused**: Critical information (deadlines) is immediately visible
2. **Action-Oriented**: Users can act directly from the dashboard
3. **Scalable**: Works with 1 prazo or 100 prazos
4. **Flexible**: Timeline can be added/removed based on context
5. **Mobile-Friendly**: List view adapts well to small screens
6. **Accessible**: Keyboard navigation, ARIA labels, screen reader support

### Next Steps

This design is ready for implementation in **Step 15 – Implement Dashboard: Prazos Section**.

---

**Completed**: ✅ January 15, 2026
