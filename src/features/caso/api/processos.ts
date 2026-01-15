import apiClient from '../../../config/api';

// Processo Types
export type StatusProcesso = 'em_andamento' | 'aguardando_citacao' | 'suspenso' | 'arquivado' | 'concluido';

export interface ProcessoSummary {
  id: string;
  casoId: string;
  numero: string; // Processo number (e.g., "0001234-56.2024.8.02.0001")
  status: StatusProcesso;
  vara: string; // Court/Chamber name
  comarca: string; // District/Region
  uf: string; // State abbreviation (e.g., "SP", "RJ")
  tipo: string; // Process type (e.g., "Ação de Cobrança", "Execução")
  valor?: number; // Monetary value if applicable
  dataDistribuicao: string; // Distribution date (ISO 8601)
  ultimaMovimentacao?: string; // Last movement date (ISO 8601)
  ultimaMovimentacaoTexto?: string; // Last movement text
  parteAutora: string; // Plaintiff name
  parteRe: string; // Defendant name
  advogadosAutor?: string[]; // Plaintiff attorneys
  advogadosReu?: string[]; // Defendant attorneys
  link?: string; // External link to tribunal system
}

export interface ProcessoDetail extends ProcessoSummary {
  movimentacoes: ProcessoMovimentacao[];
  audiencias: ProcessoAudiencia[];
  documentos: ProcessoDocumento[];
}

export interface ProcessoMovimentacao {
  id: string;
  data: string; // ISO 8601 date
  descricao: string;
  tipo?: string;
}

export interface ProcessoAudiencia {
  id: string;
  data: string; // ISO 8601 date-time
  tipo: string;
  local?: string;
  situacao: 'agendada' | 'realizada' | 'cancelada';
}

export interface ProcessoDocumento {
  id: string;
  nome: string;
  tipo: string;
  data: string; // ISO 8601 date
  url?: string;
}

export interface LinkProcessoRequest {
  numero: string;
  vara: string;
  comarca: string;
  uf: string;
  tipo: string;
  valor?: number;
  dataDistribuicao: string;
  parteAutora: string;
  parteRe: string;
  link?: string;
}

// Placeholder API Service
export const processoService = {
  /**
   * Get all Processos linked to a specific Caso
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @returns Array of Processo summaries
   */
  getProcessosByCaso: async (groupId: string, casoId: string): Promise<ProcessoSummary[]> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.get(`/office-group/${groupId}/caso/${casoId}/processos`);
    // return response.data;
    
    // Placeholder: Return mock data
    return Promise.resolve([
      {
        id: 'processo-001',
        casoId: casoId,
        numero: '0001234-56.2024.8.02.0001',
        status: 'em_andamento',
        vara: '1ª Vara Cível',
        comarca: 'Maceió',
        uf: 'AL',
        tipo: 'Ação de Cobrança',
        valor: 150000.00,
        dataDistribuicao: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        ultimaMovimentacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        ultimaMovimentacaoTexto: 'Juntada de petição pela parte autora',
        parteAutora: 'Cliente XYZ Ltda',
        parteRe: 'Empresa ABC S.A.',
        advogadosAutor: ['João Silva', 'Maria Santos'],
        advogadosReu: ['Pedro Costa'],
        link: 'https://exemplo.tjal.jus.br/processo/0001234-56.2024.8.02.0001'
      },
      {
        id: 'processo-002',
        casoId: casoId,
        numero: '0007890-12.2024.8.02.0002',
        status: 'aguardando_citacao',
        vara: '2ª Vara Cível',
        comarca: 'Maceió',
        uf: 'AL',
        tipo: 'Execução de Título Extrajudicial',
        valor: 85000.00,
        dataDistribuicao: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        ultimaMovimentacao: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        ultimaMovimentacaoTexto: 'Expedido mandado de citação',
        parteAutora: 'Cliente XYZ Ltda',
        parteRe: 'Empresa DEF Ltda',
        advogadosAutor: ['João Silva'],
        link: 'https://exemplo.tjal.jus.br/processo/0007890-12.2024.8.02.0002'
      },
      {
        id: 'processo-003',
        casoId: casoId,
        numero: '0003456-78.2024.8.02.0001',
        status: 'suspenso',
        vara: '1ª Vara Cível',
        comarca: 'Maceió',
        uf: 'AL',
        tipo: 'Ação Declaratória',
        dataDistribuicao: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        ultimaMovimentacao: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        ultimaMovimentacaoTexto: 'Processo suspenso por acordo entre as partes',
        parteAutora: 'Cliente XYZ Ltda',
        parteRe: 'Empresa GHI S.A.',
        advogadosAutor: ['Maria Santos'],
        advogadosReu: ['Ana Lima'],
        link: 'https://exemplo.tjal.jus.br/processo/0003456-78.2024.8.02.0001'
      }
    ]);
  },

  /**
   * Get detailed information about a specific Processo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param processoId - Processo ID
   * @returns Detailed Processo information
   */
  getProcessoDetail: async (groupId: string, casoId: string, processoId: string): Promise<ProcessoDetail> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.get(`/office-group/${groupId}/caso/${casoId}/processos/${processoId}`);
    // return response.data;
    
    // Placeholder: Return mock detailed data
    const processos = await processoService.getProcessosByCaso(groupId, casoId);
    const summary = processos.find(p => p.id === processoId);
    
    if (!summary) {
      throw new Error('Processo not found');
    }
    
    return Promise.resolve({
      ...summary,
      movimentacoes: [
        {
          id: 'mov-001',
          data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          descricao: 'Juntada de petição pela parte autora',
          tipo: 'Petição'
        },
        {
          id: 'mov-002',
          data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          descricao: 'Conclusos para decisão',
          tipo: 'Despacho'
        }
      ],
      audiencias: [
        {
          id: 'aud-001',
          data: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          tipo: 'Audiência de Instrução',
          local: 'Sala 3 - 1ª Vara Cível',
          situacao: 'agendada'
        }
      ],
      documentos: [
        {
          id: 'doc-001',
          nome: 'Petição Inicial',
          tipo: 'PDF',
          data: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    });
  },

  /**
   * Link a new Processo to a Caso
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param data - Processo link data
   * @returns Created Processo summary
   */
  linkProcesso: async (groupId: string, casoId: string, data: LinkProcessoRequest): Promise<ProcessoSummary> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.post(`/office-group/${groupId}/caso/${casoId}/processos`, data);
    // return response.data;
    
    // Placeholder: Return mock created Processo
    return Promise.resolve({
      id: `processo-${Date.now()}`,
      casoId: casoId,
      ...data,
      status: 'em_andamento' as StatusProcesso,
      ultimaMovimentacao: new Date().toISOString(),
      ultimaMovimentacaoTexto: 'Processo vinculado ao caso'
    });
  },

  /**
   * Unlink a Processo from a Caso
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param processoId - Processo ID
   */
  unlinkProcesso: async (groupId: string, casoId: string, processoId: string): Promise<void> => {
    // TODO: Replace with actual API call when endpoint is available
    // await apiClient.delete(`/office-group/${groupId}/caso/${casoId}/processos/${processoId}`);
    
    // Placeholder: Simulate successful unlink
    return Promise.resolve();
  },

  /**
   * Sync Processo data from external tribunal system
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param processoId - Processo ID
   * @returns Updated Processo summary
   */
  syncProcesso: async (groupId: string, casoId: string, processoId: string): Promise<ProcessoSummary> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.post(`/office-group/${groupId}/caso/${casoId}/processos/${processoId}/sync`);
    // return response.data;
    
    // Placeholder: Return mock synced data
    const processos = await processoService.getProcessosByCaso(groupId, casoId);
    const existing = processos.find(p => p.id === processoId);
    
    return Promise.resolve({
      ...existing!,
      ultimaMovimentacao: new Date().toISOString(),
      ultimaMovimentacaoTexto: 'Dados atualizados via sincronização'
    });
  }
};
