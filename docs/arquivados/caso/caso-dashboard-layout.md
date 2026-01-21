# Caso Dashboard Layout Design

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 2 of 8

---

## Overview

This document defines the detailed layout and component structure for the **Caso Tab** of the "Visualizar Caso" screen. The Caso Tab serves as both a dashboard (strategic overview) and workspace (operational hub).

---

## 1. Layout Structure

### Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER SECTION (Fixed)                                          │
│  - Breadcrumb                                                    │
│  - Caso Title (H1)                                               │
│  - Edit Button                                                   │
├─────────────────────────────────────────────────────────────────┤
│  TAB NAVIGATION                                                  │
│  [ 📊 Caso ]  [ ✓ Tarefas ]                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║ DASHBOARD SECTION (Scrollable)                            ║  │
│  ║                                                            ║  │
│  ║ 1. Status Summary Cards (4 cards in grid)                 ║  │
│  ║ 2. Core Information Panel                                 ║  │
│  ║ 3. Descrição Section                                      ║  │
│  ║ 4. Clientes & Partes Section                             ║  │
│  ║ 5. Processos Vinculados Section                          ║  │
│  ║ 6. Próximos Prazos Section                               ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                   │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║ WORKSPACE SECTION (Scrollable)                            ║  │
│  ║                                                            ║  │
│  ║ 7. Movimentações / Histórico                             ║  │
│  ║ 8. Arquivos                                               ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Container Layout
- **Max Width**: 1400px (centered)
- **Padding**: 24px (desktop), 16px (mobile)
- **Gap between sections**: 24px (desktop), 16px (mobile)
- **Section dividers**: Subtle border or background color change

---

## 2. Section Breakdown

### Section 1: Status Summary Cards

**Purpose**: At-a-glance metrics for quick status assessment

**Layout**: 4-column grid (responsive: 2x2 on tablet, 1 column on mobile)

**Priority**: High - Visible without scrolling

#### Card Components

```typescript
interface StatusCard {
  id: string;
  title: string;
  value: number | string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  linkTo?: string; // Optional navigation
  loading?: boolean;
}
```

#### Card Specifications

| Card | Title | Data Source | Icon | Color | Action |
|------|-------|-------------|------|-------|--------|
| **1** | Tarefas Abertas | Count from Tarefas API | ✓ | Blue | Link to Tarefas tab |
| **2** | Processos Ativos | Count from Processos API (placeholder) | 📑 | Green | Link to Processos section |
| **3** | Prazos Próximos | Count from Prazos API (placeholder) | ⏰ | Yellow | Link to Prazos section |
| **4** | Arquivos | Count from Arquivos API (placeholder) | 📎 | Purple | Link to Arquivos section |

#### Card Design
```tsx
<div className="rounded-lg border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-title-md font-bold text-black dark:text-white">
        {value}
      </h4>
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${color}`}>
      {icon}
    </div>
  </div>
</div>
```

**Component**: `CasoStatusCards.tsx` (reuse `CardDataStats` pattern)

---

### Section 2: Core Information Panel

**Purpose**: Essential metadata about the Caso

**Layout**: Single panel with 2-column grid inside (responsive: 1 column on mobile)

**Priority**: High

#### Fields Displayed

| Field | Label | Data Type | Editable | Display Format | Priority |
|-------|-------|-----------|----------|----------------|----------|
| **ID** | ID do Caso | UUID (short) | No | `#${id.slice(0, 8)}` | Medium |
| **Status** | Status | Enum/String | No | Badge | High |
| **Responsável** | Responsável | Employee reference | Via Edit | Name + Avatar | High |
| **Unidade** | Unidade | OfficeUnit reference | Via Edit | Unit name | High |
| **Funcionários** | Equipe | Employee[] | Via Edit | Avatars + count | High |
| **Criado em** | Data de Criação | DateTime | No | `DD/MM/YYYY` | Low |
| **Criado por** | Criado por | String | No | Name | Low |
| **Atualizado em** | Última Atualização | DateTime | No | Relative time | Medium |

#### Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <h3 className="font-medium text-black dark:text-white">
      Informações do Caso
    </h3>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Left Column */}
      <InfoField label="ID do Caso" value={shortId} />
      <InfoField label="Status" value={<StatusBadge status={status} />} />
      <InfoField label="Responsável" value={<EmployeeDisplay employee={responsavel} />} />
      <InfoField label="Unidade" value={officeUnit?.name} />
      
      {/* Right Column */}
      <InfoField label="Equipe" value={<EmployeeAvatarGroup employees={employees} />} />
      <InfoField label="Criado em" value={formatDate(criadoEm)} />
      <InfoField label="Criado por" value={criadoPor} />
      <InfoField label="Atualizado" value={formatRelativeTime(atualizadoEm)} />
    </div>
  </div>
</div>
```

#### Sub-Components

**`InfoField`**: Reusable field display
```tsx
interface InfoFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={className}>
      <span className="text-sm font-medium text-black dark:text-white">
        {label}
      </span>
      <div className="mt-1 text-sm">{value || '—'}</div>
    </div>
  );
}
```

**`StatusBadge`**: Status indicator
```tsx
function StatusBadge({ status }: { status: string }) {
  const colorMap = {
    'ativo': 'bg-success text-white',
    'em_andamento': 'bg-warning text-white',
    'concluido': 'bg-meta-3 text-white',
    'arquivado': 'bg-meta-1 text-white'
  };
  
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
}
```

**`EmployeeAvatarGroup`**: Display employee avatars
```tsx
function EmployeeAvatarGroup({ employees, max = 5 }: { employees: Employee[], max?: number }) {
  const visible = employees.slice(0, max);
  const overflow = employees.length - max;
  
  return (
    <div className="flex -space-x-2">
      {visible.map(emp => (
        <img 
          key={emp.id}
          src={emp.avatar || '/default-avatar.png'}
          alt={emp.name}
          className="h-8 w-8 rounded-full border-2 border-white"
          title={emp.name}
        />
      ))}
      {overflow > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-meta-4 text-xs">
          +{overflow}
        </div>
      )}
    </div>
  );
}
```

**Component**: `CasoCoreInfo.tsx`

---

### Section 3: Descrição Section

**Purpose**: Display the full case description

**Layout**: Single text block with expand/collapse if long

**Priority**: High

#### Design Specification

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <h3 className="font-medium text-black dark:text-white">
      Descrição do Caso
    </h3>
  </div>
  <div className="p-6">
    <p className="text-sm leading-relaxed text-body">
      {descricao || 'Nenhuma descrição fornecida.'}
    </p>
  </div>
</div>
```

#### Features
- **Read-only** in view mode
- **Max height**: 300px with scroll if text exceeds
- **Empty state**: "Nenhuma descrição fornecida."
- **Markdown support** (optional future enhancement)

**Component**: Part of `CasoCoreInfo.tsx` or standalone `CasoDescricao.tsx`

---

### Section 4: Clientes & Partes Section

**Purpose**: Display all clients associated with the case

**Layout**: Card-based list with avatars and key info

**Priority**: Critical - Primary actors in the case

#### Data Structure

```typescript
interface ClientDisplay {
  id: string;
  nome: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  cpf?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  avatar?: string;
}
```

#### Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-black dark:text-white">
        Clientes ({clients.length})
      </h3>
      <button className="text-sm text-primary hover:underline">
        Ver Todos
      </button>
    </div>
  </div>
  <div className="p-6">
    {clients.length === 0 ? (
      <EmptyState message="Nenhum cliente vinculado" />
    ) : (
      <div className="grid gap-4 sm:grid-cols-2">
        {clients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    )}
  </div>
</div>
```

#### Client Card Design

```tsx
function ClientCard({ client }: { client: ClientDisplay }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-stroke p-4 dark:border-strokedark">
      <div className="h-12 w-12 flex-shrink-0">
        <img 
          src={client.avatar || '/default-avatar.png'} 
          alt={client.nome}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-black dark:text-white">
          {client.nome}
        </h4>
        <p className="text-sm text-bodydark">
          {client.cpf ? `CPF: ${formatCPF(client.cpf)}` : 
           client.cnpj ? `CNPJ: ${formatCNPJ(client.cnpj)}` : ''}
        </p>
        {client.email && (
          <p className="text-xs text-bodydark">{client.email}</p>
        )}
      </div>
      <button 
        onClick={() => navigateToClient(client.id)}
        className="text-primary hover:text-primary/80"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
```

#### Empty State

```tsx
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <svg className="h-12 w-12 text-bodydark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <p className="mt-2 text-sm text-bodydark">{message}</p>
    </div>
  );
}
```

**Component**: `CasoClientesSection.tsx`

---

### Section 5: Processos Vinculados Section

**Purpose**: Display legal processes linked to this case

**Layout**: List view with status indicators

**Priority**: High

#### Data Structure (Placeholder)

```typescript
interface ProcessoSummary {
  id: string;
  numero: string;
  tribunal?: string;
  vara?: string;
  status: 'em_andamento' | 'aguardando_citacao' | 'suspenso' | 'concluido';
  dataAbertura: string;
  ultimaMovimentacao?: string;
}
```

#### Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-black dark:text-white">
        Processos Vinculados ({processos.length})
      </h3>
      <button 
        onClick={() => handleAddProcesso()}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <span>+</span> Vincular Processo
      </button>
    </div>
  </div>
  <div className="p-6">
    {processos.length === 0 ? (
      <EmptyState message="Nenhum processo vinculado" />
    ) : (
      <div className="space-y-3">
        {processos.map(processo => (
          <ProcessoItem key={processo.id} processo={processo} />
        ))}
      </div>
    )}
  </div>
</div>
```

#### Processo Item Design

```tsx
function ProcessoItem({ processo }: { processo: ProcessoSummary }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-black dark:text-white">
            {processo.numero}
          </h4>
          <StatusBadge status={processo.status} />
        </div>
        {processo.tribunal && (
          <p className="mt-1 text-sm text-bodydark">
            {processo.tribunal} {processo.vara && `- ${processo.vara}`}
          </p>
        )}
        {processo.ultimaMovimentacao && (
          <p className="mt-1 text-xs text-bodydark">
            Última movimentação: {formatRelativeTime(processo.ultimaMovimentacao)}
          </p>
        )}
      </div>
      <button 
        onClick={() => navigateToProcesso(processo.id)}
        className="ml-4 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
      >
        Ver Detalhes
      </button>
    </div>
  );
}
```

**Component**: `CasoProcessosSection.tsx`

**API Placeholder**:
```typescript
// src/features/caso/api/processos.ts
export async function getProcessosByCasoId(casoId: string): Promise<ProcessoSummary[]> {
  // TODO: Replace with actual API call
  return [];
}
```

---

### Section 6: Próximos Prazos Section

**Purpose**: Display upcoming deadlines

**Layout**: Timeline or list with urgency indicators

**Priority**: High

#### Data Structure (Placeholder)

```typescript
interface Prazo {
  id: string;
  titulo: string;
  descricao?: string;
  data: string; // ISO date
  responsavel?: Employee;
  status: 'pendente' | 'concluido' | 'vencido';
  tipo?: 'audiencia' | 'recurso' | 'manifestacao' | 'outro';
}
```

#### Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-black dark:text-white">
        Próximos Prazos ({prazos.filter(p => p.status === 'pendente').length})
      </h3>
      <button 
        onClick={() => handleAddPrazo()}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <span>+</span> Adicionar Prazo
      </button>
    </div>
  </div>
  <div className="p-6">
    {prazos.length === 0 ? (
      <EmptyState message="Nenhum prazo cadastrado" />
    ) : (
      <div className="space-y-3">
        {prazos
          .filter(p => p.status === 'pendente')
          .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
          .slice(0, 5) // Show only next 5
          .map(prazo => (
            <PrazoItem key={prazo.id} prazo={prazo} />
          ))}
      </div>
    )}
    {prazos.filter(p => p.status === 'pendente').length > 5 && (
      <button className="mt-4 text-sm text-primary hover:underline">
        Ver todos os prazos ({prazos.filter(p => p.status === 'pendente').length})
      </button>
    )}
  </div>
</div>
```

#### Prazo Item Design

```tsx
function PrazoItem({ prazo }: { prazo: Prazo }) {
  const daysUntil = Math.ceil((new Date(prazo.data).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3;
  const isOverdue = daysUntil < 0;
  
  return (
    <div className={`flex items-start gap-4 rounded-lg border p-4 ${
      isOverdue ? 'border-danger bg-danger/10' : 
      isUrgent ? 'border-warning bg-warning/10' : 
      'border-stroke dark:border-strokedark'
    }`}>
      <div className="flex-shrink-0">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isOverdue ? 'bg-danger' : isUrgent ? 'bg-warning' : 'bg-primary'
        } text-white`}>
          <span className="text-lg font-bold">{Math.abs(daysUntil)}</span>
        </div>
        <p className="mt-1 text-center text-xs">
          {isOverdue ? 'Vencido' : 'Dias'}
        </p>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-black dark:text-white">
          {prazo.titulo}
        </h4>
        <p className="mt-1 text-sm text-bodydark">
          {formatDate(prazo.data)}
        </p>
        {prazo.descricao && (
          <p className="mt-1 text-sm text-bodydark">{prazo.descricao}</p>
        )}
        {prazo.responsavel && (
          <p className="mt-2 text-xs text-bodydark">
            Responsável: {prazo.responsavel.name}
          </p>
        )}
      </div>
      <button className="text-bodydark hover:text-black">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
}
```

**Component**: `CasoPrazosSection.tsx`

**API Placeholder**:
```typescript
// src/features/caso/api/prazos.ts
export async function getPrazosByCasoId(casoId: string): Promise<Prazo[]> {
  // TODO: Replace with actual API call
  return [];
}

export async function createPrazo(casoId: string, data: CreatePrazoRequest): Promise<Prazo> {
  // TODO: Replace with actual API call
  throw new Error('Not implemented');
}
```

---

### Section 7: Movimentações / Histórico Section

**Purpose**: Activity timeline and add new updates

**Layout**: Timeline with input area at top

**Priority**: High - Workspace element

#### Data Structure (Placeholder)

```typescript
interface Movimentacao {
  id: string;
  tipo: 'comentario' | 'arquivo_anexado' | 'status_alterado' | 'prazo_adicionado' | 'outro';
  titulo: string;
  descricao?: string;
  criadoPor: string;
  criadoEm: string;
  metadata?: Record<string, any>; // Additional context
}
```

#### Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <h3 className="font-medium text-black dark:text-white">
      Histórico e Movimentações
    </h3>
  </div>
  <div className="p-6">
    {/* Input Area */}
    <MovimentacaoInput onSubmit={handleAddMovimentacao} />
    
    {/* Timeline */}
    <div className="mt-6">
      {movimentacoes.length === 0 ? (
        <EmptyState message="Nenhuma movimentação registrada" />
      ) : (
        <div className="space-y-4">
          {movimentacoes.map((mov, index) => (
            <MovimentacaoItem 
              key={mov.id} 
              movimentacao={mov} 
              isLast={index === movimentacoes.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  </div>
</div>
```

#### Movimentação Input Design

```tsx
function MovimentacaoInput({ onSubmit }: { onSubmit: (data: string) => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(text);
      setText('');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-stroke p-4 dark:border-strokedark">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Adicionar atualização, nota ou comentário..."
        className="w-full resize-none border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
        rows={3}
      />
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-bodydark">
          Markdown suportado
        </div>
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
```

#### Movimentação Item Design

```tsx
function MovimentacaoItem({ movimentacao, isLast }: { movimentacao: Movimentacao, isLast: boolean }) {
  const iconMap = {
    comentario: '💬',
    arquivo_anexado: '📎',
    status_alterado: '🔄',
    prazo_adicionado: '⏰',
    outro: '•'
  };
  
  return (
    <div className="flex gap-4">
      <div className="relative flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          {iconMap[movimentacao.tipo]}
        </div>
        {!isLast && (
          <div className="h-full w-0.5 bg-stroke dark:bg-strokedark" />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-black dark:text-white">
              {movimentacao.titulo}
            </h4>
            <p className="text-xs text-bodydark">
              {movimentacao.criadoPor} • {formatRelativeTime(movimentacao.criadoEm)}
            </p>
          </div>
        </div>
        {movimentacao.descricao && (
          <p className="mt-2 text-sm text-body">{movimentacao.descricao}</p>
        )}
      </div>
    </div>
  );
}
```

**Component**: `CasoMovimentacoes.tsx`

**API Placeholder**:
```typescript
// src/features/caso/api/movimentacoes.ts
export async function getMovimentacoesByCasoId(casoId: string): Promise<Movimentacao[]> {
  // TODO: Replace with actual API call
  return [];
}

export async function createMovimentacao(
  casoId: string, 
  data: CreateMovimentacaoRequest
): Promise<Movimentacao> {
  // TODO: Replace with actual API call
  throw new Error('Not implemented');
}
```

---

### Section 8: Arquivos Section

**Purpose**: File upload and management

**Layout**: Upload area + file list

**Priority**: High - Workspace element

#### Data Structure (Placeholder)

```typescript
interface Arquivo {
  id: string;
  nome: string;
  tamanho: number; // bytes
  tipo: string; // MIME type
  url: string;
  criadoPor: string;
  criadoEm: string;
}
```

#### Layout Structure

```tsx
<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-black dark:text-white">
        Arquivos ({arquivos.length})
      </h3>
    </div>
  </div>
  <div className="p-6">
    {/* Upload Area */}
    <FileUploadArea onUpload={handleUpload} />
    
    {/* File List */}
    <div className="mt-6">
      {arquivos.length === 0 ? (
        <EmptyState message="Nenhum arquivo anexado" />
      ) : (
        <div className="space-y-2">
          {arquivos.map(arquivo => (
            <ArquivoItem 
              key={arquivo.id} 
              arquivo={arquivo}
              onDelete={() => handleDelete(arquivo.id)}
            />
          ))}
        </div>
      )}
    </div>
  </div>
</div>
```

#### File Upload Area Design

```tsx
function FileUploadArea({ onUpload }: { onUpload: (files: FileList) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      onUpload(e.dataTransfer.files);
    }
  };
  
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-stroke dark:border-strokedark'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
      />
      <svg className="mx-auto h-12 w-12 text-bodydark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="mt-4 text-sm font-medium">
        Arraste arquivos aqui ou{' '}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-primary hover:underline"
        >
          procure no computador
        </button>
      </p>
      <p className="mt-1 text-xs text-bodydark">
        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (máx. 10MB)
      </p>
    </div>
  );
}
```

#### Arquivo Item Design

```tsx
function ArquivoItem({ arquivo, onDelete }: { arquivo: Arquivo, onDelete: () => void }) {
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm(`Deseja realmente excluir "${arquivo.nome}"?`)) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4">
      <div className="flex items-center gap-3">
        <FileIcon tipo={arquivo.tipo} />
        <div>
          <h4 className="text-sm font-medium text-black dark:text-white">
            {arquivo.nome}
          </h4>
          <p className="text-xs text-bodydark">
            {formatFileSize(arquivo.tamanho)} • {arquivo.criadoPor} • {formatRelativeTime(arquivo.criadoEm)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={arquivo.url}
          download={arquivo.nome}
          className="rounded p-2 text-primary hover:bg-primary/10"
          title="Baixar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded p-2 text-danger hover:bg-danger/10 disabled:opacity-50"
          title="Excluir"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

**Component**: `CasoArquivos.tsx`

**API Placeholder**:
```typescript
// src/features/caso/api/arquivos.ts
export async function getArquivosByCasoId(casoId: string): Promise<Arquivo[]> {
  // TODO: Replace with actual API call
  return [];
}

export async function uploadArquivo(casoId: string, file: File): Promise<Arquivo> {
  // TODO: Replace with actual API call
  throw new Error('Not implemented');
}

export async function deleteArquivo(casoId: string, arquivoId: string): Promise<void> {
  // TODO: Replace with actual API call
  throw new Error('Not implemented');
}
```

---

## 3. Component Structure

### Component Hierarchy

```
CasoViewPage/
├── CasoViewHeader/
│   ├── Breadcrumb
│   ├── CasoTitle (H1)
│   └── EditButton
├── CasoViewTabs/
│   └── CasoTab/
│       ├── CasoDashboard/ (SECTIONS 1-6)
│       │   ├── CasoStatusCards
│       │   ├── CasoCoreInfo
│       │   ├── CasoDescricao
│       │   ├── CasoClientesSection
│       │   ├── CasoProcessosSection
│       │   └── CasoPrazosSection
│       └── CasoWorkspace/ (SECTIONS 7-8)
│           ├── CasoMovimentacoes
│           └── CasoArquivos
```

### Shared/Utility Components

- `InfoField` - Labeled field display
- `StatusBadge` - Status indicator
- `EmployeeAvatarGroup` - Employee avatars
- `EmptyState` - Empty state message
- `FileIcon` - File type icon
- `ConfirmDialog` - Confirmation dialog

---

## 4. Field Editability Matrix

| Field | Section | Editable In View | Edit Method | Required |
|-------|---------|------------------|-------------|----------|
| Título | Header | No | Via Edit Page | Yes |
| Descrição | Dashboard | No | Via Edit Page | No |
| Responsável | Core Info | No | Via Edit Page | Yes |
| Unidade | Core Info | No | Via Edit Page | Yes |
| Funcionários | Core Info | No | Via Edit Page | No |
| Clientes | Dashboard | No | Via Edit Page | Yes |
| Status | Core Info | No | System Managed | - |
| Processos | Dashboard | Add Only | Inline Modal | No |
| Prazos | Dashboard | Add/Edit | Inline Modal | No |
| Movimentações | Workspace | Add Only | Inline Input | No |
| Arquivos | Workspace | Add/Delete | Inline Upload | No |

**Edit Strategy**: 
- **Core caso data** (título, descrição, responsável, unidade, funcionários, clientes): Navigate to Edit Page
- **Linked entities** (processos, prazos): Inline modals
- **Activity data** (movimentações, arquivos): Inline inputs/uploads

---

## 5. Responsive Behavior

### Breakpoints

| Screen Size | Layout Changes |
|-------------|----------------|
| Mobile (<640px) | - Status cards: 1 column<br>- Core info: 1 column<br>- All sections stack vertically |
| Tablet (640px-1024px) | - Status cards: 2x2 grid<br>- Core info: 2 columns<br>- Client cards: 1-2 columns |
| Desktop (>1024px) | - Status cards: 4 columns<br>- Core info: 2 columns<br>- Client cards: 2 columns<br>- Full width sections |

### Mobile Optimizations
- Collapsible sections with expand/collapse
- Simplified cards with essential info only
- Bottom sheet for actions instead of modals
- Sticky header with title and edit button

---

## 6. Loading & Error States

### Loading States

```tsx
// Skeleton for Status Cards
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
  {[1, 2, 3, 4].map(i => (
    <div key={i} className="rounded-lg border border-stroke bg-white p-6 shadow-default">
      <div className="animate-pulse">
        <div className="h-8 w-16 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
      </div>
    </div>
  ))}
</div>

// Skeleton for Info Panel
<div className="rounded-sm border border-stroke bg-white p-6 shadow-default">
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-4 w-full rounded bg-gray-200" />
    ))}
  </div>
</div>
```

### Error States

```tsx
function ErrorState({ error, onRetry }: { error: string, onRetry?: () => void }) {
  return (
    <div className="rounded-sm border border-danger bg-danger/10 p-6 text-center">
      <svg className="mx-auto h-12 w-12 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="mt-4 text-sm font-medium text-danger">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}
```

---

## 7. API Integration Summary

### Existing APIs (Available)
- ✅ `getCasoById(id)` → `CasoDetailResource`
- ✅ `getClientById(id)` → `ClientDetail`
- ✅ `getEmployeeById(id)` → `EmployeeDetail`
- ✅ `getOfficeUnitById(id)` → `OfficeUnitDetail`
- ✅ `getTarefasByQuadroId(quadroId)` → `Tarefa[]`

### Placeholder APIs (To Be Implemented)
- ❌ `getProcessosByCasoId(casoId)` → `ProcessoSummary[]`
- ❌ `getPrazosByCasoId(casoId)` → `Prazo[]`
- ❌ `createPrazo(casoId, data)` → `Prazo`
- ❌ `getMovimentacoesByCasoId(casoId)` → `Movimentacao[]`
- ❌ `createMovimentacao(casoId, data)` → `Movimentacao`
- ❌ `getArquivosByCasoId(casoId)` → `Arquivo[]`
- ❌ `uploadArquivo(casoId, file)` → `Arquivo`
- ❌ `deleteArquivo(casoId, arquivoId)` → `void`

### Data Fetching Strategy

```typescript
// Main data fetch on page load
useEffect(() => {
  const fetchCasoData = async () => {
    setLoading(true);
    try {
      // Parallel fetch for independent data
      const [caso, tarefas] = await Promise.all([
        getCasoById(casoId),
        getTarefasByQuadroId(quadroTarefasId)
      ]);
      
      // Resolve related entities
      const [clients, employees, officeUnit] = await Promise.all([
        Promise.all(caso.clientIds.map(id => getClientById(id))),
        Promise.all(caso.employees.map(emp => getEmployeeById(emp.employeeId))),
        getOfficeUnitById(caso.officeUnitId)
      ]);
      
      // Fetch placeholder data (will return empty arrays for now)
      const [processos, prazos, movimentacoes, arquivos] = await Promise.all([
        getProcessosByCasoId(casoId),
        getPrazosByCasoId(casoId),
        getMovimentacoesByCasoId(casoId),
        getArquivosByCasoId(casoId)
      ]);
      
      setState({
        caso,
        tarefas,
        clients,
        employees,
        officeUnit,
        processos,
        prazos,
        movimentacoes,
        arquivos
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchCasoData();
}, [casoId]);
```

---

## 8. Utility Functions

### Date/Time Formatting

```typescript
// src/utils/dateUtils.ts
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  const diff = new Date(date).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (Math.abs(days) < 1) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return rtf.format(hours, 'hour');
  }
  return rtf.format(days, 'day');
}
```

### File Formatting

```typescript
// src/utils/fileUtils.ts
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mimeType: string): ReactNode {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  return '📎';
}
```

### CPF/CNPJ Formatting

```typescript
// src/utils/formatters.ts
export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
```

---

## 9. Summary

This layout design provides:

1. ✅ **8 Distinct Sections**: Clear separation of dashboard vs workspace
2. ✅ **Component Specifications**: Detailed design for each section
3. ✅ **Editable Fields Matrix**: Clear rules for what can be edited where
4. ✅ **Responsive Design**: Mobile-first with progressive enhancement
5. ✅ **Loading/Error States**: Proper handling of async states
6. ✅ **API Integration Plan**: Mix of existing and placeholder APIs
7. ✅ **Reusable Components**: Modular, composable architecture
8. ✅ **Utility Functions**: Helper functions for formatting

**Next Steps**:
- ✅ Step 1: Information Architecture - COMPLETED
- ✅ Step 2: Caso Dashboard Layout - COMPLETED
- ⏭️ **Step 3: Workspace Interactions** - Ready to begin

---

**Completed**: ✅ January 15, 2026
