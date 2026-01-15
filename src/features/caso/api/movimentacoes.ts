import apiClient from '../../../config/api';

// Movimentação Types
export type TipoMovimentacao = 'atualizacao' | 'nota' | 'documento' | 'prazo' | 'tarefa' | 'sistema';

export interface Movimentacao {
  id: string;
  casoId: string;
  tipo: TipoMovimentacao;
  texto: string;
  autor: string; // User ID or name
  dataHora: string; // ISO 8601 date-time
  editado: boolean;
  editadoEm?: string;
  metadata?: {
    tarefaId?: string;
    prazoId?: string;
    arquivoId?: string;
    processoId?: string;
    [key: string]: any;
  };
}

export interface CreateMovimentacaoRequest {
  tipo: TipoMovimentacao;
  texto: string;
  metadata?: {
    tarefaId?: string;
    prazoId?: string;
    arquivoId?: string;
    processoId?: string;
    [key: string]: any;
  };
}

export interface UpdateMovimentacaoRequest {
  texto: string;
}

// Placeholder API Service
export const movimentacaoService = {
  /**
   * Get all Movimentações for a specific Caso
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param page - Page number (optional)
   * @param size - Page size (optional)
   * @returns Array of Movimentações
   */
  getMovimentacoesByCaso: async (
    groupId: string, 
    casoId: string, 
    page?: number, 
    size?: number
  ): Promise<Movimentacao[]> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.get(`/office-group/${groupId}/caso/${casoId}/movimentacoes`, {
    //   params: { page, size }
    // });
    // return response.data;
    
    // Placeholder: Return mock data
    return Promise.resolve([
      {
        id: 'mov-001',
        casoId: casoId,
        tipo: 'atualizacao',
        texto: 'Caso criado e atribuído à equipe',
        autor: 'João Silva',
        dataHora: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        editado: false
      },
      {
        id: 'mov-002',
        casoId: casoId,
        tipo: 'documento',
        texto: 'Contrato social anexado ao caso',
        autor: 'Maria Santos',
        dataHora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        editado: false,
        metadata: {
          arquivoId: 'arquivo-001'
        }
      },
      {
        id: 'mov-003',
        casoId: casoId,
        tipo: 'nota',
        texto: 'Cliente solicitou urgência na análise dos documentos',
        autor: 'João Silva',
        dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        editado: false
      },
      {
        id: 'mov-004',
        casoId: casoId,
        tipo: 'prazo',
        texto: 'Novo prazo adicionado: Audiência de instrução em 17/01/2026',
        autor: 'Sistema',
        dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        editado: false,
        metadata: {
          prazoId: 'prazo-001'
        }
      }
    ]);
  },

  /**
   * Create a new Movimentação
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param data - Movimentação creation data
   * @returns Created Movimentação
   */
  createMovimentacao: async (
    groupId: string, 
    casoId: string, 
    data: CreateMovimentacaoRequest
  ): Promise<Movimentacao> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.post(`/office-group/${groupId}/caso/${casoId}/movimentacoes`, data);
    // return response.data;
    
    // Placeholder: Return mock created Movimentação
    return Promise.resolve({
      id: `mov-${Date.now()}`,
      casoId: casoId,
      ...data,
      autor: 'Current User', // Should come from auth context
      dataHora: new Date().toISOString(),
      editado: false
    });
  },

  /**
   * Update an existing Movimentação
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param movimentacaoId - Movimentação ID
   * @param data - Movimentação update data
   * @returns Updated Movimentação
   */
  updateMovimentacao: async (
    groupId: string, 
    casoId: string, 
    movimentacaoId: string, 
    data: UpdateMovimentacaoRequest
  ): Promise<Movimentacao> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.put(`/office-group/${groupId}/caso/${casoId}/movimentacoes/${movimentacaoId}`, data);
    // return response.data;
    
    // Placeholder: Return mock updated Movimentação
    const movimentacoes = await movimentacaoService.getMovimentacoesByCaso(groupId, casoId);
    const existing = movimentacoes.find(m => m.id === movimentacaoId);
    
    return Promise.resolve({
      ...existing!,
      texto: data.texto,
      editado: true,
      editadoEm: new Date().toISOString()
    });
  },

  /**
   * Delete a Movimentação
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param movimentacaoId - Movimentação ID
   */
  deleteMovimentacao: async (
    groupId: string, 
    casoId: string, 
    movimentacaoId: string
  ): Promise<void> => {
    // TODO: Replace with actual API call when endpoint is available
    // await apiClient.delete(`/office-group/${groupId}/caso/${casoId}/movimentacoes/${movimentacaoId}`);
    
    // Placeholder: Simulate successful deletion
    return Promise.resolve();
  }
};
