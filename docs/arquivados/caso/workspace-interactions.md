# Workspace Interactions: Visualizar Caso

**Status**: ✅ Completed  
**Date**: January 15, 2026  
**Step**: 3 of 8

---

## Overview

This document defines the detailed interaction flows for workspace features in the "Visualizar Caso" screen. These interactions enable users to actively manage case activities through:

1. **Arquivo Management** - Upload, view, download, and delete files
2. **Movimentações** - Create updates, notes, and activity logs
3. **Histórico Viewing** - Browse case timeline and activity history

These workspace elements transform the screen from a passive dashboard into an active operational hub.

---

## 1. Interaction Design Principles

### Workspace vs Dashboard Distinction

| Aspect | Dashboard Elements | Workspace Elements |
|--------|-------------------|-------------------|
| **Purpose** | Information display | Active operations |
| **Interaction** | View, navigate, filter | Create, upload, delete |
| **Update Frequency** | Periodic refresh | Real-time feedback |
| **User Feedback** | Tooltips, badges | Progress indicators, toasts |
| **Error Handling** | Error states | Validation + retry |

### Key Principles
1. **Inline Actions**: Operations happen in context, not separate pages
2. **Immediate Feedback**: Visual confirmation of all actions
3. **Optimistic Updates**: UI updates before server confirmation
4. **Error Recovery**: Clear error messages with retry options
5. **Progressive Disclosure**: Show details on demand, not all at once

---

## 2. Arquivo Management Interactions

### 2.1 File Upload Flow

#### Trigger Points
1. **Drag & Drop**: User drags file over upload area
2. **Click to Upload**: User clicks upload button → file picker opens
3. **Paste**: User pastes file from clipboard (optional enhancement)

#### User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Initial State                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📎 Arquivos                                 [+ Upload] ━┓  │ │
│ │                                                            ┃  │ │
│ │   Arraste arquivos aqui ou clique para selecionar         ┃  │ │
│ │   Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG   ┃  │ │
│ │   Tamanho máximo: 10MB por arquivo                         ┃  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User drags file OR clicks upload button
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 2. File Selection / Drag Active                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📎 Arquivos                                               │ │
│ │                                                              │ │
│ │   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ │
│ │   ┃  Solte os arquivos aqui                             ┃  │ │
│ │   ┃  📁 Pronto para upload                               ┃  │ │
│ │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User drops file OR selects from picker
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 3. Validation & Preview                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📎 Arquivos                                               │ │
│ │                                                              │ │
│ │   Arquivos selecionados (2):                                │ │
│ │   ✓ contrato.pdf (1.2 MB) ────────────────────── [Remover] │ │
│ │   ✓ documento.docx (856 KB) ─────────────────── [Remover]  │ │
│ │                                                              │ │
│ │   [Cancelar]                          [Fazer Upload] ━━━┓  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User clicks "Fazer Upload"
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 4. Upload in Progress                                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📎 Arquivos                                               │ │
│ │                                                              │ │
│ │   Fazendo upload...                                          │ │
│ │   contrato.pdf ████████████░░░░░░░░ 65%                    │ │
│ │   documento.docx ███████████████████ 100% ✓                │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ Upload completes
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 5. Success State                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   [Toast] ✓ 2 arquivos enviados com sucesso                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📎 Arquivos (4)                               [+ Upload]  │ │
│ │                                                              │ │
│ │   📄 contrato.pdf (1.2 MB)                                  │ │
│ │      Enviado há 1 minuto por João Silva                     │ │
│ │      [↓ Download] [🗑️ Excluir]                              │ │
│ │                                                              │ │
│ │   📄 documento.docx (856 KB) ← [NEW BADGE]                  │ │
│ │      Enviado agora por João Silva                           │ │
│ │      [↓ Download] [🗑️ Excluir]                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Validation Rules

| Validation | Rule | Error Message | Recovery Action |
|------------|------|---------------|-----------------|
| **File Size** | Max 10MB per file | "Arquivo excede 10MB. Selecione um arquivo menor." | Remove file, allow reselection |
| **File Type** | PDF, DOC, DOCX, XLS, XLSX, JPG, PNG | "Formato não suportado. Use: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG" | Remove file, allow reselection |
| **Duplicate Name** | No duplicate filenames in same caso | "Arquivo com este nome já existe. Renomeie ou substitua." | Offer rename or replace options |
| **Network Error** | Upload failed | "Falha no upload. Verifique sua conexão e tente novamente." | Retry button with same file |
| **Server Error** | 500 response | "Erro no servidor. Tente novamente em alguns instantes." | Retry button |

#### State Management

```typescript
interface ArquivoUploadState {
  // Upload state
  uploading: boolean;
  progress: Record<string, number>; // filename -> percentage
  selectedFiles: File[];
  
  // Uploaded files
  arquivos: Arquivo[];
  loading: boolean;
  error: string | null;
  
  // UI state
  isDragging: boolean;
  showUploadPreview: boolean;
}

interface Arquivo {
  id: string;
  nome: string;
  tamanho: number; // bytes
  tipo: string; // MIME type
  url: string; // download URL
  criadoEm: string;
  criadoPor: string;
  casoId: string;
}
```

#### User Feedback

**Visual Indicators**:
- **Drag Active**: Blue dashed border + background color change
- **Upload Progress**: Progress bar per file + percentage
- **Success**: Green checkmark + toast notification
- **Error**: Red X + error message + retry button

**Toast Notifications**:
```typescript
// Success
"✓ Arquivo enviado com sucesso"
"✓ 3 arquivos enviados com sucesso"

// Error
"✗ Falha ao enviar arquivo. Tente novamente."
"✗ Arquivo muito grande. Tamanho máximo: 10MB"
```

---

### 2.2 File Download Flow

#### User Journey

```
User clicks [Download] button
        │
        ▼
Show loading spinner on button
        │
        ▼
Fetch file from server
        │
        ├─── Success ──→ Browser download dialog
        │                Show toast: "Download iniciado"
        │
        └─── Error ────→ Show toast: "Falha no download. Tente novamente."
                         Show retry button
```

#### Implementation

```typescript
async function handleDownload(arquivo: Arquivo) {
  try {
    setDownloading(arquivo.id);
    
    const response = await fetch(arquivo.url);
    const blob = await response.blob();
    
    // Trigger browser download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = arquivo.nome;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    fireToast('success', 'Download iniciado');
  } catch (error) {
    fireToast('error', 'Falha no download. Tente novamente.');
  } finally {
    setDownloading(null);
  }
}
```

---

### 2.3 File Deletion Flow

#### User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Initial State                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📄 contrato.pdf (1.2 MB)                                  │ │
│ │      Enviado há 2 dias por João Silva                       │ │
│ │      [↓ Download] [🗑️ Excluir] ← User hovers               │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User clicks [Excluir]
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 2. Confirmation Dialog                                           │
│                                                                   │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │  ⚠️  Confirmar exclusão                                   │ │
│   │                                                            │ │
│   │  Tem certeza que deseja excluir "contrato.pdf"?          │ │
│   │  Esta ação não pode ser desfeita.                        │ │
│   │                                                            │ │
│   │  [Cancelar]                        [Excluir Arquivo] ━┓  │ │
│   └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User clicks [Excluir Arquivo]
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 3. Deleting State                                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📄 contrato.pdf (1.2 MB) [FADED OUT]                      │ │
│ │      Excluindo... ⏳                                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ Delete completes
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 4. Success State                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   [Toast] ✓ Arquivo excluído com sucesso                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📎 Arquivos (3)                               [+ Upload]  │ │
│ │                                                              │ │
│ │   [File is removed from list]                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Confirmation Dialog

```typescript
interface ConfirmDeleteDialogProps {
  arquivo: Arquivo;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function ConfirmDeleteDialog({ arquivo, onConfirm, onCancel, isDeleting }: ConfirmDeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Confirmar exclusão
          </h3>
        </div>
        
        <p className="mb-6 text-body">
          Tem certeza que deseja excluir <strong>"{arquivo.nome}"</strong>?
          <br />
          Esta ação não pode ser desfeita.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded border border-stroke px-4 py-2 hover:bg-gray"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded bg-danger px-4 py-2 text-white hover:bg-opacity-90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Arquivo'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Optimistic Delete

```typescript
async function handleDelete(arquivo: Arquivo) {
  // Optimistically remove from UI
  const previousArquivos = arquivos;
  setArquivos(arquivos.filter(a => a.id !== arquivo.id));
  
  try {
    await deleteArquivo(casoId, arquivo.id);
    fireToast('success', 'Arquivo excluído com sucesso');
  } catch (error) {
    // Rollback on error
    setArquivos(previousArquivos);
    fireToast('error', 'Falha ao excluir arquivo. Tente novamente.');
  }
}
```

---

## 3. Movimentação Creation Interactions

### 3.1 Add Movimentação Flow

#### Trigger Points
1. **Click Input Area**: User clicks text input to add note
2. **Keyboard Shortcut**: Ctrl/Cmd + M to focus input (optional)

#### User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Initial State (Collapsed)                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📝 Movimentações                                          │ │
│ │                                                              │ │
│ │   Clique para adicionar uma nova movimentação... ━━━━━━━┓  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User clicks input area
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 2. Expanded Input State                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📝 Movimentações                                          │ │
│ │                                                              │ │
│ │   ┌────────────────────────────────────────────────────┐   │ │
│ │   │ Descreva a movimentação...                         │   │ │
│ │   │                                                     │   │ │
│ │   │ [User types here]                                  │   │ │
│ │   │                                                     │   │ │
│ │   └────────────────────────────────────────────────────┘   │ │
│ │                                                              │ │
│ │   Tipo: [Nota ▼]  [Opcional: Anexar arquivo]               │ │
│ │                                                              │ │
│ │   [Cancelar]                         [Adicionar] ━━━━━━┓   │ │
│ │                                           (disabled) ━━━┛   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User types text (minimum 10 characters)
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 3. Valid Input State                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📝 Movimentações                                          │ │
│ │                                                              │ │
│ │   ┌────────────────────────────────────────────────────┐   │ │
│ │   │ Cliente confirmou recebimento da proposta de       │   │ │
│ │   │ acordo extrajudicial. Aguardando assinatura.       │   │ │
│ │   └────────────────────────────────────────────────────┘   │ │
│ │                                                              │ │
│ │   Tipo: [Nota ▼]  [Opcional: Anexar arquivo]               │ │
│ │                                                              │ │
│ │   [Cancelar]                         [Adicionar] ━━━━━━┓   │ │
│ │                                           (enabled) ━━━━┛   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ User clicks [Adicionar]
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 4. Submitting State                                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📝 Movimentações                                          │ │
│ │                                                              │ │
│ │   Adicionando... ⏳                                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

        │ API call succeeds
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ 5. Success State                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   [Toast] ✓ Movimentação adicionada com sucesso            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │   📝 Movimentações (15)                                     │ │
│ │                                                              │ │
│ │   Clique para adicionar uma nova movimentação...            │ │
│ │                                                              │ │
│ │   ═══════════════════════════════════════════════════════   │ │
│ │                                                              │ │
│ │   📝 [NEW BADGE] Agora • João Silva                         │ │
│ │   Cliente confirmou recebimento da proposta de acordo       │ │
│ │   extrajudicial. Aguardando assinatura.                     │ │
│ │                                                              │ │
│ │   ───────────────────────────────────────────────────────   │ │
│ │                                                              │ │
│ │   📄 Há 2 horas • Maria Santos                              │ │
│ │   Petição inicial protocolada no sistema do tribunal.       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Movimentação Types

```typescript
enum MovimentacaoTipo {
  NOTA = 'nota',                    // Generic note/comment
  PETICAO = 'peticao',              // Legal petition filed
  DECISAO = 'decisao',              // Court decision received
  AUDIENCIA = 'audiencia',          // Hearing scheduled/occurred
  PRAZO = 'prazo',                  // Deadline created/met
  DOCUMENTO = 'documento',          // Document received/sent
  CONTATO = 'contato',              // Client/party contact
  SISTEMA = 'sistema'               // System-generated event
}

interface CreateMovimentacaoRequest {
  casoId: string;
  tipo: MovimentacaoTipo;
  descricao: string;
  arquivoId?: string; // Optional linked file
  metadata?: Record<string, any>;
}
```

#### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| **Min Length** | 10 characters | "Descrição deve ter pelo menos 10 caracteres" |
| **Max Length** | 5000 characters | "Descrição não pode exceder 5000 caracteres" |
| **Required** | Not empty | "Descrição é obrigatória" |
| **Tipo** | Valid enum value | "Tipo de movimentação inválido" |

#### Component Implementation

```typescript
function MovimentacaoInput({ casoId, onSuccess }: MovimentacaoInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState<MovimentacaoTipo>(MovimentacaoTipo.NOTA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isValid = texto.trim().length >= 10;
  
  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newMovimentacao = await createMovimentacao(casoId, {
        tipo,
        descricao: texto.trim(),
      });
      
      // Reset form
      setTexto('');
      setIsExpanded(false);
      
      // Notify parent
      onSuccess(newMovimentacao);
      
      fireToast('success', 'Movimentação adicionada com sucesso');
    } catch (err) {
      setError('Falha ao adicionar movimentação. Tente novamente.');
      fireToast('error', 'Falha ao adicionar movimentação');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setTexto('');
    setIsExpanded(false);
    setError(null);
  };
  
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full rounded-lg border-2 border-dashed border-stroke p-4 text-left text-body hover:border-primary hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
      >
        Clique para adicionar uma nova movimentação...
      </button>
    );
  }
  
  return (
    <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Descreva a movimentação..."
        rows={4}
        className="w-full rounded border border-stroke p-3 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4"
        autoFocus
      />
      
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Tipo:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as MovimentacaoTipo)}
            className="rounded border border-stroke px-3 py-1 dark:border-strokedark dark:bg-meta-4"
          >
            <option value={MovimentacaoTipo.NOTA}>Nota</option>
            <option value={MovimentacaoTipo.PETICAO}>Petição</option>
            <option value={MovimentacaoTipo.DECISAO}>Decisão</option>
            <option value={MovimentacaoTipo.AUDIENCIA}>Audiência</option>
            <option value={MovimentacaoTipo.CONTATO}>Contato</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="rounded border border-stroke px-4 py-2 hover:bg-gray dark:border-strokedark"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Histórico Viewing Interactions

### 4.1 Timeline Display

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ 📝 Movimentações (15)                                           │
│                                                                  │
│ [Input area for new movimentação]                               │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ Filtros: [Todos ▼] [Últimos 7 dias ▼]              [Atualizar] │
│                                                                  │
│ ─────────────────────────────────────────────────────────────── │
│                                                                  │
│ ●───┐ Hoje, 14:32 • João Silva                                  │
│     │ 📝 Nota                                                    │
│     │ Cliente confirmou recebimento da proposta de acordo        │
│     │ extrajudicial. Aguardando assinatura.                      │
│     │                                                             │
│ ○───┤ Hoje, 10:15 • Maria Santos                                │
│     │ 📄 Petição                                                 │
│     │ Petição inicial protocolada no sistema do tribunal.        │
│     │ [📎 peticao_inicial.pdf]                                   │
│     │                                                             │
│ ○───┤ Ontem, 16:45 • Sistema                                    │
│     │ ⏰ Prazo                                                   │
│     │ Prazo criado: Responder à citação até 20/01/2026          │
│     │                                                             │
│ ○───┤ 13/01/2026, 09:00 • Pedro Oliveira                        │
│     │ 🗣️ Contato                                                │
│     │ Reunião com cliente. Discutidas estratégias de defesa.    │
│     │                                                             │
│     │ [Carregar mais] ─────────────────────────────────────────→ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Visual Hierarchy

| Element | Visual Treatment |
|---------|------------------|
| **Most Recent** | Filled circle (●), bold timestamp |
| **Older Items** | Empty circle (○), regular timestamp |
| **Timeline Line** | Vertical line connecting circles |
| **Type Icon** | Icon based on MovimentacaoTipo |
| **Attached Files** | Clickable file badge below text |
| **System Events** | Lighter text color, smaller font |

#### Filtering & Sorting

```typescript
interface MovimentacaoFilters {
  tipo?: MovimentacaoTipo | 'todos';
  periodo?: 'hoje' | 'ultimos_7_dias' | 'ultimos_30_dias' | 'todos';
  autor?: string; // Employee ID or 'todos'
}

function applyFilters(
  movimentacoes: Movimentacao[],
  filters: MovimentacaoFilters
): Movimentacao[] {
  let filtered = [...movimentacoes];
  
  // Filter by type
  if (filters.tipo && filters.tipo !== 'todos') {
    filtered = filtered.filter(m => m.tipo === filters.tipo);
  }
  
  // Filter by period
  if (filters.periodo && filters.periodo !== 'todos') {
    const now = new Date();
    const cutoff = new Date();
    
    switch (filters.periodo) {
      case 'hoje':
        cutoff.setHours(0, 0, 0, 0);
        break;
      case 'ultimos_7_dias':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'ultimos_30_dias':
        cutoff.setDate(now.getDate() - 30);
        break;
    }
    
    filtered = filtered.filter(m => new Date(m.criadoEm) >= cutoff);
  }
  
  // Sort by date (newest first)
  return filtered.sort((a, b) => 
    new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
  );
}
```

#### Pagination

```typescript
interface PaginationState {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

function MovimentacoesTimeline({ casoId }: { casoId: string }) {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    hasMore: true,
  });
  const [loading, setLoading] = useState(false);
  
  const loadMore = async () => {
    if (loading || !pagination.hasMore) return;
    
    setLoading(true);
    try {
      const newMovimentacoes = await getMovimentacoesByCasoId(casoId, {
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
      });
      
      setMovimentacoes([...movimentacoes, ...newMovimentacoes]);
      setPagination({
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        hasMore: newMovimentacoes.length === pagination.pageSize,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {/* Timeline items */}
      {movimentacoes.map((mov, index) => (
        <MovimentacaoItem
          key={mov.id}
          movimentacao={mov}
          isLatest={index === 0}
        />
      ))}
      
      {/* Load more button */}
      {pagination.hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full py-3 text-primary hover:underline"
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  );
}
```

---

### 4.2 Expandable Details

#### Interaction Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│ Initial State (Collapsed)                                        │
│                                                                   │
│ ○───┐ 13/01/2026, 14:30 • João Silva         [Ver detalhes ▼]  │
│     │ 📄 Petição                                                 │
│     │ Apresentada contestação ao pedido inicial...               │
│     │                                                             │
└─────────────────────────────────────────────────────────────────┘

        │ User clicks [Ver detalhes]
        ▼

┌─────────────────────────────────────────────────────────────────┐
│ Expanded State                                                    │
│                                                                   │
│ ○───┐ 13/01/2026, 14:30 • João Silva         [Ocultar ▲]       │
│     │ 📄 Petição                                                 │
│     │ Apresentada contestação ao pedido inicial no processo      │
│     │ 1234567-89.2026.8.02.0000. Argumentos principais:          │
│     │ - Ilegitimidade passiva                                    │
│     │ - Prescrição parcial do débito                             │
│     │ - Contestação de valores cobrados                          │
│     │                                                             │
│     │ Arquivos anexados:                                          │
│     │ [📎 contestacao.pdf (2.3 MB) - Download]                   │
│     │ [📎 documentos_prova.pdf (1.8 MB) - Download]              │
│     │                                                             │
│     │ Metadados:                                                  │
│     │ • ID da Movimentação: mov_abc123                           │
│     │ • Processo vinculado: 1234567-89.2026.8.02.0000            │
│     │ • Atualizado em: 13/01/2026, 14:35                         │
│     │                                                             │
└─────────────────────────────────────────────────────────────────┘
```

#### Implementation

```typescript
function MovimentacaoItem({ 
  movimentacao, 
  isLatest 
}: { 
  movimentacao: Movimentacao; 
  isLatest: boolean; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const icon = getIconForTipo(movimentacao.tipo);
  const timeAgo = formatTimeAgo(movimentacao.criadoEm);
  
  // Truncate long descriptions
  const preview = movimentacao.descricao.slice(0, 150);
  const needsExpand = movimentacao.descricao.length > 150;
  
  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className={`h-4 w-4 rounded-full ${isLatest ? 'bg-primary' : 'bg-stroke'}`} />
        <div className="w-0.5 flex-1 bg-stroke" />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between">
          <div>
            <span className={`text-sm ${isLatest ? 'font-semibold' : ''}`}>
              {timeAgo} • {movimentacao.criadoPor}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-sm font-medium text-body">
                {getTipoLabel(movimentacao.tipo)}
              </span>
            </div>
          </div>
          
          {needsExpand && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary hover:underline"
            >
              {isExpanded ? 'Ocultar ▲' : 'Ver detalhes ▼'}
            </button>
          )}
        </div>
        
        {/* Description */}
        <p className="text-body">
          {isExpanded ? movimentacao.descricao : preview}
          {!isExpanded && needsExpand && '...'}
        </p>
        
        {/* Attached files */}
        {movimentacao.arquivoId && (
          <div className="mt-2">
            <FileAttachment arquivoId={movimentacao.arquivoId} />
          </div>
        )}
        
        {/* Metadata (only in expanded state) */}
        {isExpanded && movimentacao.metadata && (
          <div className="mt-3 rounded border border-stroke p-3 text-sm dark:border-strokedark">
            <p className="font-medium">Metadados:</p>
            <ul className="mt-2 space-y-1 text-body">
              <li>• ID: {movimentacao.id}</li>
              {Object.entries(movimentacao.metadata).map(([key, value]) => (
                <li key={key}>• {key}: {value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Integration with Dashboard

### 5.1 Real-time Updates

#### New Activity Indicator

```
┌─────────────────────────────────────────────────────────────────┐
│ 📝 Movimentações (15)                      [● 3 novas]         │
│                                             └── Pulse animation │
└─────────────────────────────────────────────────────────────────┘
```

When new movimentações are added (by other users or system):
1. Show badge with count of new items
2. Pulse animation to draw attention
3. Auto-scroll to top on user click
4. Mark items as "seen" after viewing

#### Implementation

```typescript
function MovimentacoesSection({ casoId }: { casoId: string }) {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);
  
  // Poll for new movimentacoes every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const latest = await getMovimentacoesByCasoId(casoId, { 
        page: 1, 
        pageSize: 5 
      });
      
      const unseen = latest.filter(m => 
        !lastSeenId || m.id > lastSeenId
      );
      
      if (unseen.length > 0) {
        setNewCount(unseen.length);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [casoId, lastSeenId]);
  
  const handleViewNew = () => {
    // Scroll to top and refresh
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLastSeenId(movimentacoes[0]?.id || null);
    setNewCount(0);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3>📝 Movimentações ({movimentacoes.length})</h3>
        
        {newCount > 0 && (
          <button
            onClick={handleViewNew}
            className="flex items-center gap-2 text-primary animate-pulse"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            {newCount} novas
          </button>
        )}
      </div>
      
      {/* Timeline content */}
    </div>
  );
}
```

---

### 5.2 Cross-section Interactions

#### Arquivo → Movimentação Link

When a file is uploaded, automatically create a movimentação:

```typescript
async function handleFileUpload(file: File) {
  try {
    // Upload file
    const arquivo = await uploadArquivo(casoId, file);
    
    // Auto-create movimentação
    await createMovimentacao(casoId, {
      tipo: MovimentacaoTipo.DOCUMENTO,
      descricao: `Arquivo "${file.name}" adicionado ao caso`,
      arquivoId: arquivo.id,
      metadata: {
        arquivoNome: arquivo.nome,
        arquivoTamanho: arquivo.tamanho,
      },
    });
    
    fireToast('success', 'Arquivo enviado e registrado no histórico');
  } catch (error) {
    fireToast('error', 'Falha ao enviar arquivo');
  }
}
```

#### Prazo → Movimentação Link

When a prazo is created or met, create a movimentação:

```typescript
async function handleCreatePrazo(data: CreatePrazoRequest) {
  try {
    const prazo = await createPrazo(casoId, data);
    
    // Auto-create movimentação
    await createMovimentacao(casoId, {
      tipo: MovimentacaoTipo.PRAZO,
      descricao: `Prazo criado: ${prazo.descricao} até ${formatDate(prazo.data)}`,
      metadata: {
        prazoId: prazo.id,
        prazoData: prazo.data,
      },
    });
    
    fireToast('success', 'Prazo criado e registrado');
  } catch (error) {
    fireToast('error', 'Falha ao criar prazo');
  }
}
```

---

## 6. Error Handling & Edge Cases

### 6.1 Network Errors

| Scenario | User Experience | Recovery Action |
|----------|----------------|-----------------|
| **Upload fails midway** | Show progress bar stuck at X% | Retry button with same file |
| **API timeout** | Show "Operação demorando mais que o esperado" | Auto-retry after 5s, max 3 attempts |
| **Offline mode** | Show banner: "Você está offline. Alterações serão sincronizadas quando conectar." | Queue operations, sync on reconnect |
| **429 Rate Limit** | Show "Muitas requisições. Aguarde um momento." | Exponential backoff retry |
| **500 Server Error** | Show "Erro no servidor. Nossa equipe foi notificada." | Manual retry button |

### 6.2 Validation Errors

| Scenario | User Experience |
|----------|----------------|
| **File too large** | Inline error below file: "Arquivo excede 10MB" + Remove button |
| **Invalid file type** | Inline error: "Formato não suportado" + List of allowed types |
| **Empty movimentação** | Disable submit button + Show character count "0/10 mínimo" |
| **Duplicate filename** | Modal: "Arquivo já existe. [Substituir] [Renomear] [Cancelar]" |

### 6.3 Empty States

```typescript
// No movimentações yet
function EmptyMovimentacoes() {
  return (
    <div className="py-12 text-center">
      <span className="text-6xl">📝</span>
      <h3 className="mt-4 text-lg font-medium">Nenhuma movimentação ainda</h3>
      <p className="mt-2 text-body">
        Adicione a primeira movimentação para começar o histórico do caso
      </p>
    </div>
  );
}

// No arquivos yet
function EmptyArquivos() {
  return (
    <div className="py-12 text-center">
      <span className="text-6xl">📎</span>
      <h3 className="mt-4 text-lg font-medium">Nenhum arquivo anexado</h3>
      <p className="mt-2 text-body">
        Arraste arquivos aqui ou clique para fazer upload
      </p>
    </div>
  );
}
```

---

## 7. Performance Optimizations

### 7.1 Lazy Loading

```typescript
// Load movimentações on scroll (infinite scroll)
function useInfiniteScroll(loadMore: () => void) {
  const observerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    
    return () => observer.disconnect();
  }, [loadMore]);
  
  return observerRef;
}
```

### 7.2 Optimistic Updates

```typescript
// Add movimentação optimistically
function useOptimisticMovimentacao() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  
  const addOptimistic = (tempMovimentacao: Omit<Movimentacao, 'id'>) => {
    const optimistic: Movimentacao = {
      ...tempMovimentacao,
      id: `temp_${Date.now()}`,
    };
    
    setMovimentacoes([optimistic, ...movimentacoes]);
    
    return {
      commit: (realMovimentacao: Movimentacao) => {
        setMovimentacoes(prev =>
          prev.map(m => m.id === optimistic.id ? realMovimentacao : m)
        );
      },
      rollback: () => {
        setMovimentacoes(prev =>
          prev.filter(m => m.id !== optimistic.id)
        );
      },
    };
  };
  
  return { movimentacoes, addOptimistic };
}
```

### 7.3 Debounced Search/Filter

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in filter component
function MovimentacoesFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    // Trigger search with debounced value
    if (debouncedSearch) {
      searchMovimentacoes(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar movimentações..."
    />
  );
}
```

---

## 8. Accessibility Considerations

### 8.1 Keyboard Navigation

| Action | Keyboard Shortcut |
|--------|------------------|
| Focus movimentação input | Ctrl/Cmd + M |
| Submit movimentação | Ctrl/Cmd + Enter |
| Cancel input | Escape |
| Navigate timeline items | Tab / Shift+Tab |
| Expand/collapse details | Enter / Space (when focused) |
| Upload file | Ctrl/Cmd + U |

### 8.2 Screen Reader Support

```typescript
// ARIA labels and live regions
<div 
  role="region" 
  aria-label="Movimentações do caso"
  aria-live="polite"
  aria-atomic="false"
>
  <button
    aria-label="Adicionar nova movimentação"
    aria-expanded={isExpanded}
    onClick={() => setIsExpanded(true)}
  >
    Clique para adicionar...
  </button>
  
  <div aria-live="polite" aria-atomic="true">
    {uploading && <span>Upload em progresso: {progress}%</span>}
    {uploadComplete && <span>Upload concluído com sucesso</span>}
  </div>
</div>
```

### 8.3 Focus Management

```typescript
// Focus input when expanded
useEffect(() => {
  if (isExpanded && inputRef.current) {
    inputRef.current.focus();
  }
}, [isExpanded]);

// Return focus to trigger after closing modal
function ConfirmDeleteDialog({ onClose }: { onClose: () => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    return () => {
      triggerRef.current?.focus();
    };
  }, []);
  
  // ... dialog content
}
```

---

## 9. Mobile Optimizations

### 9.1 Touch Interactions

```typescript
// Swipe to delete arquivo
function ArquivoItem({ arquivo, onDelete }: ArquivoItemProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const handleTouchStart = (e: TouchEvent) => {
    setIsSwiping(true);
    // Track initial position
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    // Update swipe position
    setSwipeX(/* calculate swipe distance */);
  };
  
  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    // If swiped far enough, trigger delete
    if (swipeX < -100) {
      onDelete();
    }
    
    // Reset position
    setSwipeX(0);
  };
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateX(${swipeX}px)` }}
    >
      {/* Arquivo content */}
    </div>
  );
}
```

### 9.2 Responsive Upload Area

```css
/* Mobile: Full-width upload area */
@media (max-width: 640px) {
  .upload-area {
    min-height: 120px;
    font-size: 14px;
  }
  
  .upload-area-text {
    display: block;
    text-align: center;
  }
}

/* Desktop: More spacious */
@media (min-width: 641px) {
  .upload-area {
    min-height: 200px;
    font-size: 16px;
  }
}
```

---

## 10. Summary & Next Steps

### Workspace Interactions Defined

✅ **Arquivo Management**
- Upload flow with drag-and-drop
- Download with progress tracking
- Delete with confirmation dialog
- Validation and error handling

✅ **Movimentação Creation**
- Expandable input area
- Type selection
- Real-time validation
- Optimistic updates

✅ **Histórico Viewing**
- Timeline visualization
- Filtering and pagination
- Expandable details
- Real-time activity indicators

✅ **Integration Patterns**
- Cross-section links (arquivo → movimentação)
- Auto-generated activity logs
- Unified error handling

✅ **UX Enhancements**
- Empty states
- Loading states
- Keyboard shortcuts
- Mobile optimizations

---

### Implementation Checklist

| Component | Status |
|-----------|--------|
| `CasoArquivos.tsx` | Ready to implement |
| `ArquivoUploadArea.tsx` | Ready to implement |
| `ArquivoItem.tsx` | Ready to implement |
| `CasoMovimentacoes.tsx` | Ready to implement |
| `MovimentacaoInput.tsx` | Ready to implement |
| `MovimentacaoItem.tsx` | Ready to implement |
| `MovimentacoesTimeline.tsx` | Ready to implement |
| `ConfirmDeleteDialog.tsx` | Ready to implement |

### API Placeholders to Create

```typescript
// src/features/caso/api/arquivos.ts
export async function getArquivosByCasoId(casoId: string): Promise<Arquivo[]>
export async function uploadArquivo(casoId: string, file: File): Promise<Arquivo>
export async function deleteArquivo(casoId: string, arquivoId: string): Promise<void>

// src/features/caso/api/movimentacoes.ts
export async function getMovimentacoesByCasoId(casoId: string, params?: PaginationParams): Promise<Movimentacao[]>
export async function createMovimentacao(casoId: string, data: CreateMovimentacaoRequest): Promise<Movimentacao>
```

---

**Next Step**: Proceed to **Step 4 - Prazos & Timeline Visualization**

---

**Completed**: ✅ January 15, 2026
