import apiClient from '../../../config/api';

// Arquivo Types
export interface Arquivo {
  id: string;
  casoId: string;
  nome: string;
  nomeOriginal: string;
  tipo: string; // MIME type (e.g., 'application/pdf', 'image/jpeg')
  extensao: string; // File extension (e.g., 'pdf', 'jpg')
  tamanho: number; // File size in bytes
  url: string; // Download URL
  uploadedAt: string; // ISO 8601 date-time
  uploadedBy: string; // User ID or name
  metadata?: {
    descricao?: string;
    tags?: string[];
    processoId?: string;
    [key: string]: any;
  };
}

export interface UploadArquivoRequest {
  file: File;
  descricao?: string;
  tags?: string[];
  processoId?: string;
}

export interface ArquivoMetadata {
  descricao?: string;
  tags?: string[];
  processoId?: string;
}

// Placeholder API Service
export const arquivoService = {
  /**
   * Get all Arquivos for a specific Caso
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @returns Array of Arquivos
   */
  getArquivosByCaso: async (groupId: string, casoId: string): Promise<Arquivo[]> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.get(`/office-group/${groupId}/caso/${casoId}/arquivos`);
    // return response.data;
    
    // Placeholder: Return mock data
    return Promise.resolve([
      {
        id: 'arquivo-001',
        casoId: casoId,
        nome: 'contrato_social.pdf',
        nomeOriginal: 'contrato_social.pdf',
        tipo: 'application/pdf',
        extensao: 'pdf',
        tamanho: 1245678, // ~1.2 MB
        url: '/api/files/arquivo-001',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        uploadedBy: 'Maria Santos',
        metadata: {
          descricao: 'Contrato social da empresa cliente',
          tags: ['contrato', 'societário']
        }
      },
      {
        id: 'arquivo-002',
        casoId: casoId,
        nome: 'procuracao.pdf',
        nomeOriginal: 'procuracao.pdf',
        tipo: 'application/pdf',
        extensao: 'pdf',
        tamanho: 856234, // ~856 KB
        url: '/api/files/arquivo-002',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        uploadedBy: 'João Silva',
        metadata: {
          descricao: 'Procuração do cliente',
          tags: ['procuração', 'representação']
        }
      },
      {
        id: 'arquivo-003',
        casoId: casoId,
        nome: 'documentos_identificacao.zip',
        nomeOriginal: 'documentos_identificacao.zip',
        tipo: 'application/zip',
        extensao: 'zip',
        tamanho: 3456789, // ~3.3 MB
        url: '/api/files/arquivo-003',
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        uploadedBy: 'Maria Santos',
        metadata: {
          descricao: 'Documentos de identificação dos sócios',
          tags: ['identificação', 'documentação']
        }
      }
    ]);
  },

  /**
   * Upload a new Arquivo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param data - File upload data
   * @returns Uploaded Arquivo
   */
  uploadArquivo: async (
    groupId: string, 
    casoId: string, 
    data: UploadArquivoRequest
  ): Promise<Arquivo> => {
    // TODO: Replace with actual API call when endpoint is available
    // const formData = new FormData();
    // formData.append('file', data.file);
    // if (data.descricao) formData.append('descricao', data.descricao);
    // if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    // if (data.processoId) formData.append('processoId', data.processoId);
    // 
    // const response = await apiClient.post(
    //   `/office-group/${groupId}/caso/${casoId}/arquivos`,
    //   formData,
    //   { headers: { 'Content-Type': 'multipart/form-data' } }
    // );
    // return response.data;
    
    // Placeholder: Return mock uploaded Arquivo
    const fileExtension = data.file.name.split('.').pop() || 'bin';
    const mimeType = data.file.type || 'application/octet-stream';
    
    return Promise.resolve({
      id: `arquivo-${Date.now()}`,
      casoId: casoId,
      nome: data.file.name,
      nomeOriginal: data.file.name,
      tipo: mimeType,
      extensao: fileExtension,
      tamanho: data.file.size,
      url: `/api/files/arquivo-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User', // Should come from auth context
      metadata: {
        descricao: data.descricao,
        tags: data.tags,
        processoId: data.processoId
      }
    });
  },

  /**
   * Update Arquivo metadata
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param arquivoId - Arquivo ID
   * @param metadata - Updated metadata
   * @returns Updated Arquivo
   */
  updateArquivoMetadata: async (
    groupId: string, 
    casoId: string, 
    arquivoId: string, 
    metadata: ArquivoMetadata
  ): Promise<Arquivo> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.patch(
    //   `/office-group/${groupId}/caso/${casoId}/arquivos/${arquivoId}`,
    //   metadata
    // );
    // return response.data;
    
    // Placeholder: Return mock updated Arquivo
    const arquivos = await arquivoService.getArquivosByCaso(groupId, casoId);
    const existing = arquivos.find(a => a.id === arquivoId);
    
    return Promise.resolve({
      ...existing!,
      metadata: {
        ...existing!.metadata,
        ...metadata
      }
    });
  },

  /**
   * Delete an Arquivo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param arquivoId - Arquivo ID
   */
  deleteArquivo: async (groupId: string, casoId: string, arquivoId: string): Promise<void> => {
    // TODO: Replace with actual API call when endpoint is available
    // await apiClient.delete(`/office-group/${groupId}/caso/${casoId}/arquivos/${arquivoId}`);
    
    // Placeholder: Simulate successful deletion
    return Promise.resolve();
  },

  /**
   * Download an Arquivo
   * @param groupId - Office group ID
   * @param casoId - Caso ID
   * @param arquivoId - Arquivo ID
   * @returns Blob for download
   */
  downloadArquivo: async (groupId: string, casoId: string, arquivoId: string): Promise<Blob> => {
    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiClient.get(
    //   `/office-group/${groupId}/caso/${casoId}/arquivos/${arquivoId}/download`,
    //   { responseType: 'blob' }
    // );
    // return response.data;
    
    // Placeholder: Return empty blob
    return Promise.resolve(new Blob(['Placeholder file content'], { type: 'application/octet-stream' }));
  }
};
