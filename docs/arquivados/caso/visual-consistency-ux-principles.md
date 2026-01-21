# Visual Consistency & UX Principles

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 7 of 8

---

## Overview

This document defines the visual design system and UX principles for the "Visualizar Caso" screen, ensuring consistency, clarity, and optimal user experience across both dashboard and workspace contexts.

---

## 1. Core Design Principles

### 1.1 Information Density Philosophy

The screen must balance two competing needs:
- **Dashboard**: High information density for quick scanning
- **Workspace**: Focused interaction areas with clear affordances

#### Density Guidelines

| Context | Density Level | Characteristics | Example |
|---------|---------------|-----------------|---------|
| **Dashboard** | High | Compact cards, minimal padding, dense grids | Status cards, metadata panels |
| **Workspace** | Medium | Clear input areas, generous click targets | Upload zones, text editors |
| **Critical Actions** | Low | Large buttons, clear labels, ample spacing | Primary CTAs, confirmations |

#### Implementation Rules

```typescript
// Spacing scale (Tailwind-based)
const spacing = {
  xs: '0.5rem',  // 8px  - Tight: Status badges, inline elements
  sm: '0.75rem', // 12px - Compact: Card padding (mobile)
  md: '1rem',    // 16px - Default: Card padding (desktop)
  lg: '1.5rem',  // 24px - Comfortable: Section spacing
  xl: '2rem',    // 32px - Spacious: Major section dividers
  '2xl': '3rem'  // 48px - Generous: Header spacing
};

// Card padding by context
const cardPadding = {
  dashboard: 'px-4 py-4 md:px-6 md:py-6',      // Compact on mobile, generous on desktop
  workspace: 'px-6 py-6',                       // Always generous
  summary: 'px-4 py-3',                         // Tight for status cards
  detail: 'px-6 py-8'                           // Spacious for focused content
};
```

### 1.2 Visual Hierarchy Principles

#### Priority Levels

```typescript
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface HierarchyRules {
  critical: {
    fontSize: 'text-xl md:text-2xl',           // 20-24px
    fontWeight: 'font-bold',
    color: 'text-black dark:text-white',
    spacing: 'mb-4'
  };
  high: {
    fontSize: 'text-base md:text-lg',          // 16-18px
    fontWeight: 'font-semibold',
    color: 'text-black dark:text-white',
    spacing: 'mb-3'
  };
  medium: {
    fontSize: 'text-sm md:text-base',          // 14-16px
    fontWeight: 'font-medium',
    color: 'text-body dark:text-bodydark',
    spacing: 'mb-2'
  };
  low: {
    fontSize: 'text-xs md:text-sm',            // 12-14px
    fontWeight: 'font-normal',
    color: 'text-bodydark dark:text-bodydark1',
    spacing: 'mb-1'
  };
}
```

#### Element Priority Assignment

| Element Type | Priority | Rationale |
|--------------|----------|-----------|
| Page Title (Caso name) | Critical | Primary identification |
| Section Headers | High | Content organization |
| Status Indicators | High | Decision-critical info |
| Card Titles | High | Scannable content |
| Primary Data | Medium | Supporting information |
| Metadata (dates, IDs) | Low | Reference information |
| Helper Text | Low | Contextual guidance |

### 1.3 Color Usage Strategy

#### Semantic Color Palette

```typescript
const semanticColors = {
  // Status & State
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success',
    hover: 'hover:bg-success/20',
    usage: 'Completed tasks, successful operations'
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning',
    hover: 'hover:bg-warning/20',
    usage: 'Pending items, approaching deadlines'
  },
  danger: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    border: 'border-danger',
    hover: 'hover:bg-danger/20',
    usage: 'Overdue items, errors, destructive actions'
  },
  info: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary',
    hover: 'hover:bg-primary/20',
    usage: 'Informational items, neutral states'
  },
  
  // Priority Indicators
  priority: {
    urgente: {
      color: 'text-danger',
      bg: 'bg-danger',
      icon: '🔴',
      border: 'border-l-danger'
    },
    alta: {
      color: 'text-warning',
      bg: 'bg-warning',
      icon: '🟡',
      border: 'border-l-warning'
    },
    normal: {
      color: 'text-primary',
      bg: 'bg-primary',
      icon: '🔵',
      border: 'border-l-primary'
    },
    baixa: {
      color: 'text-bodydark',
      bg: 'bg-bodydark',
      icon: '⚪',
      border: 'border-l-bodydark'
    }
  },
  
  // Surfaces
  surface: {
    primary: 'bg-white dark:bg-boxdark',
    secondary: 'bg-gray-2 dark:bg-meta-4',
    elevated: 'bg-white dark:bg-boxdark shadow-default',
    hover: 'hover:bg-gray-2 dark:hover:bg-meta-4'
  }
};
```

#### Color Usage Rules

1. **Use semantic colors consistently**
   - Red (danger): Errors, overdue, deletions
   - Yellow (warning): Pending, approaching deadlines, cautions
   - Green (success): Completed, successful operations
   - Blue (primary): Neutral actions, information, links

2. **Limit color in dense areas**
   - Dashboard: Use color sparingly for status/priority only
   - Workspace: Use color for action feedback and states

3. **Maintain sufficient contrast**
   - Text on background: Minimum 4.5:1 ratio
   - Interactive elements: Minimum 3:1 ratio
   - Use dark mode variants consistently

4. **Progressive color intensity**
   - Background: 10% opacity
   - Hover: 20% opacity
   - Border: 100% opacity
   - Text: 100% opacity

### 1.4 Emphasis Techniques

#### Visual Weight Distribution

```typescript
interface EmphasisTechniques {
  // Primary emphasis (1-2 per section)
  primary: [
    'Bold typography (font-bold)',
    'High contrast colors',
    'Larger size (text-xl+)',
    'Prominent positioning (top-left)',
    'Enclosed in colored borders'
  ];
  
  // Secondary emphasis (3-5 per section)
  secondary: [
    'Semi-bold typography (font-semibold)',
    'Medium contrast',
    'Standard size (text-base)',
    'Icons + text combination',
    'Subtle backgrounds'
  ];
  
  // Tertiary emphasis (unlimited)
  tertiary: [
    'Regular typography (font-normal)',
    'Lower contrast (text-bodydark)',
    'Smaller size (text-sm)',
    'Icon-only or text-only',
    'No background'
  ];
}
```

#### Emphasis Examples by Element

| Element | Emphasis Level | Techniques Applied |
|---------|----------------|-------------------|
| Caso Title | Primary | Bold, Large (text-2xl), Black text |
| Status Badge | Primary | Colored background, Bold text, Border |
| Section Header | Secondary | Semi-bold, Medium size, Icon |
| Card Title | Secondary | Semi-bold, Standard size |
| Metadata Label | Tertiary | Regular weight, Small size, Gray text |
| Timestamp | Tertiary | Small, Light gray, Relative format |

---

## 2. Dashboard vs Workspace Clarity

### 2.1 Visual Distinction Strategy

#### Structural Differences

```typescript
const stylesByContext = {
  dashboard: {
    // Read-only, information-dense
    container: 'rounded-sm border border-stroke bg-white shadow-default',
    padding: 'px-4 py-4 md:px-6 md:py-6',
    header: 'border-b border-stroke px-6 py-4',
    content: 'p-6',
    interaction: 'hover:bg-gray-2 cursor-pointer', // Gentle, navigational
    emphasis: 'Subtle borders, status colors, compact layout'
  },
  
  workspace: {
    // Interactive, action-focused
    container: 'rounded-lg border-2 border-stroke bg-white shadow-lg',
    padding: 'px-6 py-6',
    header: 'bg-primary/5 border-b-2 border-primary px-6 py-4',
    content: 'p-6 space-y-4',
    interaction: 'hover:border-primary hover:shadow-xl', // Strong, actionable
    emphasis: 'Thicker borders, blue accents, generous spacing'
  }
};
```

#### Visual Cues

| Aspect | Dashboard | Workspace |
|--------|-----------|-----------|
| **Border** | 1px solid border | 2px dashed border (drop zones) |
| **Shadow** | shadow-default | shadow-lg (elevated) |
| **Hover State** | Subtle background change | Strong border/shadow change |
| **Header** | Simple border-bottom | Colored background + icon |
| **Icons** | 16px, gray | 20px, primary color |
| **CTAs** | Text links | Primary buttons |
| **Feedback** | None (read-only) | Loading states, toasts |

### 2.2 Behavioral Distinction

```typescript
interface ContextBehavior {
  dashboard: {
    clickBehavior: 'navigate' | 'expand',
    hoverFeedback: 'tooltip' | 'highlight',
    mutability: 'read-only',
    dataRefresh: 'periodic' | 'on-mount',
    errorDisplay: 'inline-warning'
  };
  
  workspace: {
    clickBehavior: 'action' | 'input',
    hoverFeedback: 'cursor-change' | 'preview',
    mutability: 'editable',
    dataRefresh: 'real-time' | 'optimistic',
    errorDisplay: 'toast' | 'inline-error' | 'modal'
  };
}
```

### 2.3 Section Labeling

Use clear visual labels to distinguish sections:

```tsx
// Dashboard Section Header
<div className="flex items-center gap-2 mb-4">
  <span className="text-sm font-medium text-bodydark uppercase tracking-wide">
    📊 Dashboard
  </span>
</div>

// Workspace Section Header
<div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-primary">
  <span className="text-base font-semibold text-primary">
    ⚡ Área de Trabalho
  </span>
</div>
```

---

## 3. Empty States

### 3.1 Empty State Principles

1. **Be Helpful**: Explain why empty + what to do next
2. **Be Encouraging**: Use positive language
3. **Be Actionable**: Provide clear next steps
4. **Be Contextual**: Match the section's purpose
5. **Be Visual**: Use icons/illustrations

### 3.2 Empty State Components

```tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  illustration?: 'simple' | 'detailed';
}

function EmptyState({ icon, title, description, action, illustration = 'simple' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* Icon/Illustration */}
      <div className="mb-4 text-6xl opacity-50">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>
      
      {/* Description */}
      <p className="mb-6 text-sm text-bodydark dark:text-bodydark1 max-w-md">
        {description}
      </p>
      
      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium
            ${action.variant === 'primary' 
              ? 'bg-primary text-white hover:bg-primary/90' 
              : 'border border-stroke bg-white hover:bg-gray-2'}
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

### 3.3 Empty State Catalog

#### Tarefas (Empty)

```tsx
<EmptyState
  icon="✓"
  title="Nenhuma tarefa criada"
  description="Comece criando uma tarefa para organizar o trabalho deste caso. As tarefas ajudam a dividir o trabalho em etapas gerenciáveis."
  action={{
    label: '+ Nova Tarefa',
    onClick: () => setShowCreateModal(true),
    variant: 'primary'
  }}
/>
```

#### Processos (Empty)

```tsx
<EmptyState
  icon="📑"
  title="Nenhum processo vinculado"
  description="Este caso ainda não possui processos judiciais vinculados. Vincule processos para acompanhar suas movimentações."
  action={{
    label: '+ Vincular Processo',
    onClick: () => setShowLinkModal(true),
    variant: 'secondary'
  }}
/>
```

#### Prazos (Empty)

```tsx
<EmptyState
  icon="⏰"
  title="Nenhum prazo cadastrado"
  description="Adicione prazos importantes como audiências, recursos e manifestações para não perder nenhum compromisso."
  action={{
    label: '+ Adicionar Prazo',
    onClick: () => setShowPrazoModal(true),
    variant: 'primary'
  }}
/>
```

#### Arquivos (Empty - Dashboard)

```tsx
<EmptyState
  icon="📎"
  title="Nenhum arquivo anexado"
  description="Anexe documentos, petições, contratos e outros arquivos relacionados ao caso."
  action={{
    label: 'Ir para Arquivos',
    onClick: () => scrollToSection('arquivos'),
    variant: 'secondary'
  }}
/>
```

#### Arquivos (Empty - Workspace)

```tsx
<div className="border-2 border-dashed border-stroke rounded-lg p-12 text-center bg-gray-2/50 dark:bg-meta-4/50">
  <div className="text-5xl mb-4 opacity-50">📎</div>
  <p className="text-base font-medium mb-2 text-black dark:text-white">
    Arraste arquivos aqui
  </p>
  <p className="text-sm text-bodydark mb-4">
    ou clique para selecionar
  </p>
  <button className="text-primary hover:underline text-sm font-medium">
    Escolher arquivos
  </button>
  <p className="text-xs text-bodydark mt-4">
    Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG • Máximo 10MB
  </p>
</div>
```

#### Clientes (Empty)

```tsx
<EmptyState
  icon="👥"
  title="Nenhum cliente associado"
  description="Vincule clientes a este caso para identificar as partes envolvidas e manter informações de contato atualizadas."
  action={{
    label: '+ Adicionar Cliente',
    onClick: () => setShowClientModal(true),
    variant: 'primary'
  }}
/>
```

#### Movimentações (Empty)

```tsx
<div className="py-8 px-6 text-center border border-dashed border-stroke rounded-lg">
  <div className="text-4xl mb-3 opacity-50">📝</div>
  <p className="text-sm font-medium mb-2 text-black dark:text-white">
    Nenhuma movimentação registrada
  </p>
  <p className="text-xs text-bodydark">
    Use o campo acima para adicionar a primeira movimentação
  </p>
</div>
```

#### Kanban Column (Empty)

```tsx
<div className="flex flex-col items-center justify-center py-8 px-4 text-center opacity-50">
  <div className="text-3xl mb-2">📋</div>
  <p className="text-xs text-bodydark">
    Nenhuma tarefa
  </p>
</div>
```

#### Search/Filter Results (Empty)

```tsx
<EmptyState
  icon="🔍"
  title="Nenhum resultado encontrado"
  description="Tente ajustar os filtros ou termos de busca para encontrar o que procura."
  action={{
    label: 'Limpar Filtros',
    onClick: () => clearFilters(),
    variant: 'secondary'
  }}
/>
```

---

## 4. Loading States

### 4.1 Loading Principles

1. **Show Progress**: Indicate something is happening
2. **Preserve Layout**: Avoid layout shifts
3. **Provide Context**: Show what's loading
4. **Set Expectations**: Indicate duration when known
5. **Allow Interruption**: Provide cancel options for long operations

### 4.2 Loading State Types

#### Skeleton Loaders (Page/Section Load)

```tsx
// Status Card Skeleton
function StatusCardSkeleton() {
  return (
    <div className="rounded-lg border border-stroke bg-white px-6 py-6 shadow-default animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

// List Item Skeleton
function ListItemSkeleton() {
  return (
    <div className="border border-stroke rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

// Kanban Card Skeleton
function KanbanCardSkeleton() {
  return (
    <div className="rounded-lg border border-stroke bg-white p-4 shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
```

#### Spinner Loaders (Inline Actions)

```tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
}

function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-400'
  };
  
  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        border-2 border-t-transparent rounded-full animate-spin
      `}
    />
  );
}
```

#### Progress Bars (File Upload)

```tsx
interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning';
}

function ProgressBar({ progress, label, showPercentage = true, color = 'primary' }: ProgressBarProps) {
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning'
  };
  
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-bodydark">{label}</span>
          {showPercentage && (
            <span className="font-medium text-black">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

#### Loading Overlay (Modal Actions)

```tsx
function LoadingOverlay({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-boxdark/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-black dark:text-white">
          {message}
        </p>
      </div>
    </div>
  );
}
```

### 4.3 Loading State Catalog

| Context | Loading Type | Implementation | Duration |
|---------|-------------|----------------|----------|
| **Page Initial Load** | Full-page skeleton | Multiple skeleton components | 500-2000ms |
| **Section Refresh** | Section skeleton | Skeleton within section container | 300-1000ms |
| **Button Action** | Inline spinner in button | Spinner + disabled state | 200-1000ms |
| **File Upload** | Progress bar | ProgressBar component | Variable |
| **Form Submit** | Modal overlay | LoadingOverlay component | 500-3000ms |
| **Drag & Drop** | Spinner in drop zone | Dashed border + spinner | Immediate |
| **Infinite Scroll** | Bottom spinner | Spinner at list end | 300-1000ms |
| **Search/Filter** | Inline spinner | Spinner replacing results | 200-800ms |

### 4.4 Loading State Examples

#### Button Loading State

```tsx
<button
  disabled={isLoading}
  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading && <Spinner size="sm" color="white" />}
  {isLoading ? 'Salvando...' : 'Salvar'}
</button>
```

#### File Upload Loading

```tsx
{uploadingFiles.map(file => (
  <div key={file.name} className="border border-stroke rounded-lg p-4">
    <ProgressBar
      progress={file.progress}
      label={file.name}
      showPercentage={true}
      color={file.error ? 'warning' : 'primary'}
    />
    {file.error && (
      <p className="text-xs text-danger mt-2">{file.error}</p>
    )}
  </div>
))}
```

#### Section Loading

```tsx
function CasoProcessosSection({ casoId }: { casoId: string }) {
  const { data: processos, isLoading } = useProcessosByCasoId(casoId);
  
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold text-black">Processos Vinculados</h3>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </div>
        ) : processos?.length === 0 ? (
          <EmptyState {...emptyProcessosProps} />
        ) : (
          <ProcessosList processos={processos} />
        )}
      </div>
    </div>
  );
}
```

---

## 5. Error States

### 5.1 Error Principles

1. **Be Clear**: Explain what went wrong
2. **Be Actionable**: Provide recovery options
3. **Be Non-Blocking**: Allow continued use when possible
4. **Be Contextual**: Show errors where they occur
5. **Be Helpful**: Link to documentation or support

### 5.2 Error Display Methods

#### Inline Errors (Form Validation)

```tsx
interface FieldErrorProps {
  message: string;
}

function FieldError({ message }: FieldErrorProps) {
  return (
    <p className="mt-1 text-xs text-danger flex items-center gap-1">
      <span>⚠️</span>
      {message}
    </p>
  );
}

// Usage
<div>
  <input
    className={`border rounded px-3 py-2 ${error ? 'border-danger' : 'border-stroke'}`}
    {...field}
  />
  {error && <FieldError message={error.message} />}
</div>
```

#### Toast Errors (Action Failures)

```tsx
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Usage
fireToast({
  type: 'error',
  title: 'Falha ao salvar',
  message: 'Não foi possível salvar as alterações. Tente novamente.',
  duration: 5000
});
```

#### Section Errors (Data Load Failures)

```tsx
interface ErrorStateProps {
  title: string;
  message: string;
  retry?: () => void;
}

function ErrorState({ title, message, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h3 className="mb-2 text-lg font-semibold text-danger">
        {title}
      </h3>
      <p className="mb-6 text-sm text-bodydark max-w-md">
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-6 py-3 font-medium hover:bg-gray-2"
        >
          🔄 Tentar Novamente
        </button>
      )}
    </div>
  );
}
```

### 5.3 Error Messages Catalog

```typescript
const errorMessages = {
  // Network errors
  network: {
    title: 'Erro de conexão',
    message: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
    recoveryAction: 'Tentar Novamente'
  },
  
  // Permission errors
  forbidden: {
    title: 'Acesso negado',
    message: 'Você não tem permissão para realizar esta ação.',
    recoveryAction: 'Voltar'
  },
  
  // Not found errors
  notFound: {
    title: 'Não encontrado',
    message: 'O recurso solicitado não foi encontrado.',
    recoveryAction: 'Voltar'
  },
  
  // Validation errors
  validation: {
    required: 'Este campo é obrigatório',
    email: 'Digite um email válido',
    minLength: (min: number) => `Mínimo de ${min} caracteres`,
    maxLength: (max: number) => `Máximo de ${max} caracteres`,
    fileSize: 'Arquivo muito grande (máximo 10MB)',
    fileType: 'Formato de arquivo não suportado'
  },
  
  // Upload errors
  upload: {
    failed: {
      title: 'Falha no upload',
      message: 'Não foi possível enviar o arquivo. Tente novamente.',
      recoveryAction: 'Tentar Novamente'
    },
    tooLarge: {
      title: 'Arquivo muito grande',
      message: 'O arquivo excede o tamanho máximo de 10MB.',
      recoveryAction: 'Escolher Outro Arquivo'
    }
  },
  
  // Generic error
  generic: {
    title: 'Algo deu errado',
    message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    recoveryAction: 'Tentar Novamente'
  }
};
```

---

## 6. Responsive Behavior

### 6.1 Breakpoint Strategy

```typescript
const breakpoints = {
  mobile: '< 640px',
  tablet: '640px - 1024px',
  desktop: '> 1024px',
  wide: '> 1400px'
};

const responsiveRules = {
  mobile: {
    statusCards: 'Single column',
    coreInfo: 'Single column',
    kanban: 'Horizontal scroll or card list',
    sidebar: 'Hidden (hamburger menu)',
    padding: 'px-4 py-4',
    fontSize: 'Reduced by 1 step'
  },
  
  tablet: {
    statusCards: '2x2 grid',
    coreInfo: '2 columns',
    kanban: '2-3 columns visible',
    sidebar: 'Collapsible',
    padding: 'px-6 py-6',
    fontSize: 'Standard'
  },
  
  desktop: {
    statusCards: '4 columns',
    coreInfo: '2 columns',
    kanban: 'All 4 columns visible',
    sidebar: 'Always visible',
    padding: 'px-6 py-6',
    fontSize: 'Standard'
  }
};
```

### 6.2 Mobile-Specific Patterns

#### Stack Instead of Grid

```tsx
// Desktop: Grid
<div className="grid grid-cols-4 gap-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>

// Mobile: Stack
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

#### Bottom Sheet Instead of Modal

```tsx
// Mobile: Slide up from bottom
<div className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-white sm:static sm:rounded-lg">
  {/* Modal content */}
</div>
```

#### Swipe Actions Instead of Hover

```tsx
// Mobile: Swipe to reveal actions
<div className="swipeable-card">
  <div className="card-content">{/* ... */}</div>
  <div className="swipe-actions">
    <button>Edit</button>
    <button>Delete</button>
  </div>
</div>
```

---

## 7. Accessibility Guidelines

### 7.1 Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order (top to bottom, left to right)
- Visible focus indicators (`focus:ring-2 focus:ring-primary`)
- Escape key closes modals
- Arrow keys navigate lists/grids

### 7.2 Screen Reader Support

```tsx
// Proper ARIA labels
<button aria-label="Adicionar nova tarefa" title="Adicionar nova tarefa">
  +
</button>

// Status announcements
<div role="status" aria-live="polite">
  {uploadProgress}% completo
</div>

// Loading states
<div role="alert" aria-busy="true">
  Carregando...
</div>
```

### 7.3 Color Contrast

- Text: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Never rely on color alone for information

---

## 8. Animation Guidelines

### 8.1 Animation Principles

1. **Purpose**: Animations should serve a functional purpose
2. **Duration**: Fast (150-300ms) for most interactions
3. **Easing**: Use natural easing functions
4. **Respect Preferences**: Honor `prefers-reduced-motion`

### 8.2 Animation Catalog

```typescript
const animations = {
  // Micro-interactions
  hover: 'transition-colors duration-200',
  press: 'transition-transform duration-150 active:scale-95',
  
  // Entry/Exit
  fadeIn: 'animate-fadeIn',      // 300ms
  slideUp: 'animate-slideUp',    // 300ms
  slideDown: 'animate-slideDown', // 300ms
  
  // Loading
  pulse: 'animate-pulse',        // 2s infinite
  spin: 'animate-spin',          // 1s infinite
  
  // Attention
  bounce: 'animate-bounce',      // 1s
  shake: 'animate-shake'         // 500ms
};

// Respect user preferences
const useReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

---

## 9. Implementation Checklist

### Design System Components

- [ ] Color tokens defined and documented
- [ ] Spacing scale applied consistently
- [ ] Typography hierarchy implemented
- [ ] Empty states for all sections
- [ ] Loading states for all async operations
- [ ] Error states for all failure scenarios
- [ ] Responsive breakpoints tested
- [ ] Accessibility audit passed
- [ ] Animation performance verified
- [ ] Dark mode variants working

### Dashboard Elements

- [ ] Status cards follow dashboard style
- [ ] Read-only sections clearly marked
- [ ] Navigation hints present
- [ ] Tooltips provide context
- [ ] Hover states are subtle

### Workspace Elements

- [ ] Action areas are prominent
- [ ] Upload zones are obvious
- [ ] Input fields are generous
- [ ] Feedback is immediate
- [ ] Errors are recoverable

---

## 10. Summary

This UX guideline document establishes:

1. **Visual Consistency**: Unified color, typography, and spacing system
2. **Context Clarity**: Clear distinction between dashboard and workspace
3. **State Management**: Comprehensive empty, loading, and error states
4. **Responsive Design**: Mobile-first approach with progressive enhancement
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Performance**: Optimized animations and transitions

**Next Step**: Step 8 - Final Review & Integration Notes
