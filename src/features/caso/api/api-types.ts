// Caso API Types

export interface CasoEmployeeResource {
  employeeId: string;
  assigned: boolean;
  writePermission: boolean;
}

export interface CasoResource {
  employees: CasoEmployeeResource[];
  clientIds: string[];
  officeUnitId: string;
  title: string;
  description: string;
}

export interface UpdateCasoRequest {
  id: string;
  employees: CasoEmployeeResource[];
  clientIds: string[];
  officeUnitId: string;
  title: string;
  description: string;
}

export interface CasoDetailResource {
  id: string;
  titulo: string;
  descricao: string;
  officeUnitId: string;
  quadroTarefasId: string;
  employees: CasoEmployeeResource[];
  clientIds: string[];
}

export interface CreateCasoResponse {
  id: string;
  titulo: string;
  descricao: string;
  officeUnitId: string;
  quadroTarefasId: string;
  employees: CasoEmployeeResource[];
  clientIds: string[];
}

export interface CasoFilterRequest {
  title?: string;
  clientId?: string;
  employeeId?: string;
  officeUnitId?: string;
  page?: number;
  size?: number;
}

export interface PagedResponseCasoDetailResource {
  content: CasoDetailResource[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Quadro de Tarefas (Board) API Types

export interface StatusTarefaResource {
  id?: string;
  nome: string;
  descricao?: string;
  ordem: number;
  cor?: string;
}

export interface QuadroTarefasResource {
  id: string;
  statusTarefas: StatusTarefaResource[];
}

// Tarefa (Task) API Types

export type PrioridadeTarefa = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface TarefaResource {
  id?: string;
  statusId: string;
  colaboradorId?: string;
  titulo: string;
  descricao?: string;
  solucaoProposta?: string;
  ordem?: number;
  prazo?: string;
  estimativaHoras?: number;
  prioridade?: PrioridadeTarefa;
}

// Extended task resource for detail view with additional metadata and relations
export interface TarefaDetailResource extends TarefaResource {
  watchers?: string[]; // Array of employee IDs watching this task
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
  createdBy?: string; // Employee ID who created the task
  
  // Populated related entities (when fetched with details)
  caso?: {
    id: string;
    titulo: string;
    numero?: string;
  };
  
  colaborador?: {
    id: string;
    nome: string;
    email: string;
  };
  
  status?: {
    id: string;
    nome: string;
    cor?: string;
  };
}
