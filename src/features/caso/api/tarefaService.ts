import apiClient from '../../../config/api';
import type { TarefaResource } from './api-types';

export const tarefaService = {
  getTarefasByCaso: async (groupId: string, casoId: string): Promise<TarefaResource[]> => {
    const response = await apiClient.get(`/office-group/${groupId}/casos/${casoId}/tarefas`);
    return response.data;
  },

  getTarefasByQuadro: async (groupId: string, quadroId: string): Promise<TarefaResource[]> => {
    const response = await apiClient.get(`/office-group/${groupId}/tarefas/quadro/${quadroId}`);
    return response.data;
  },

  createTarefa: async (groupId: string, casoId: string, data: TarefaResource): Promise<TarefaResource> => {
    const response = await apiClient.post(`/office-group/${groupId}/casos/${casoId}/tarefas`, data);
    return response.data;
  },

  moveTarefa: async (groupId: string, tarefaId: string, newStatusId: string, newOrdem?: number): Promise<TarefaResource> => {
    const response = await apiClient.patch(`/office-group/${groupId}/tarefas/${tarefaId}/move`, { 
      newStatusId, 
      newOrdem 
    });
    return response.data;
  },

  reorderTarefa: async (groupId: string, tarefaId: string, newOrdem: number): Promise<TarefaResource> => {
    const response = await apiClient.patch(`/office-group/${groupId}/tarefas/${tarefaId}/reorder`, { newOrdem });
    return response.data;
  }
};
