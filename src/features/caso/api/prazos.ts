import apiClient from '../../../config/api';

// Prazo Types
export type TipoPrazo = 'audiencia' | 'peticao' | 'recurso' | 'manifestacao' | 'outro';

export interface Prazo {
  id: string;
  casoId: string;
  tipo: TipoPrazo;
  titulo: string;
  descricao?: string;
  dataHora: string; // ISO 8601 date-time
  concluido: boolean;
  processoId?: string; // Optional link to a Processo
  concluidoEm?: string;
  concluidoPor?: string;
  createdAt: string;
  createdBy: string;
}

export interface CreatePrazoRequest {
  tipo: TipoPrazo;
  titulo: string;
  descricao?: string;
  dataHora: string;
  processoId?: string;
}

export interface UpdatePrazoRequest {
  tipo?: TipoPrazo;
  titulo?: string;
  descricao?: string;
  dataHora?: string;
  concluido?: boolean;
  processoId?: string;
}

// Placeholder API Service
export const prazoService = {
  /**
   * Get all Prazos for a specific Caso
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @returns Array of Prazos
   */
  getPrazosByCaso: async (groupId: string, casoId: string): Promise<Prazo[]> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.get(`/office-group/${groupId}/caso/${casoId}/prazos`);
    // return response.data;
    
    // Placeholder: Return mock data
    return Promise.resolve([
      {
        id: 'prazo-001',
        casoId: casoId,
        tipo: 'audiencia',
        titulo: 'Audiência de instrução',
        descricao: 'Audiência para oitiva de testemunhas',
        dataHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        concluido: false,
        processoId: 'processo-001',
        createdAt: new Date().toISOString(),
        createdBy: 'user-001'
      },
      {
        id: 'prazo-002',
        casoId: casoId,
        tipo: 'peticao',
        titulo: 'Apresentar contestação',
        descricao: 'Prazo para apresentação de contestação',
        dataHora: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        concluido: false,
        createdAt: new Date().toISOString(),
        createdBy: 'user-001'
      }
    ]);
  },

  /**
   * Create a new Prazo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param data - Prazo creation data
   * @returns Created Prazo
   */
  createPrazo: async (groupId: string, casoId: string, data: CreatePrazoRequest): Promise<Prazo> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.post(`/office-group/${groupId}/caso/${casoId}/prazos`, data);
    // return response.data;
    
    // Placeholder: Return mock created Prazo
    return Promise.resolve({
      id: `prazo-${Date.now()}`,
      casoId: casoId,
      ...data,
      concluido: false,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    });
  },

  /**
   * Update an existing Prazo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param prazoId - Prazo ID
   * @param data - Prazo update data
   * @returns Updated Prazo
   */
  updatePrazo: async (groupId: string, casoId: string, prazoId: string, data: UpdatePrazoRequest): Promise<Prazo> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.put(`/office-group/${groupId}/caso/${casoId}/prazos/${prazoId}`, data);
    // return response.data;
    
    // Placeholder: Return mock updated Prazo
    const prazos = await prazoService.getPrazosByCaso(groupId, casoId);
    const existingPrazo = prazos.find(p => p.id === prazoId);
    
    return Promise.resolve({
      ...existingPrazo!,
      ...data
    });
  },

  /**
   * Delete a Prazo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param prazoId - Prazo ID
   */
  deletePrazo: async (groupId: string, casoId: string, prazoId: string): Promise<void> => {
    // TODO: Replace with actual API call when endpoint is available
    // await apiClient.delete(`/office-group/${groupId}/caso/${casoId}/prazos/${prazoId}`);
    
    // Placeholder: Simulate successful deletion
    return Promise.resolve();
  }
};
