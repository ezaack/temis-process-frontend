import apiClient from '../../../config/api';
import type { TarefaResource, TarefaDetailResource } from './api-types';

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

  // Single task operations
  getTarefa: async (groupId: string, tarefaId: string): Promise<TarefaDetailResource> => {
    const response = await apiClient.get(`/office-group/${groupId}/tarefas/${tarefaId}`);
    return response.data;
  },

  updateTarefa: async (groupId: string, tarefaId: string, data: Partial<TarefaResource>): Promise<TarefaResource> => {
    const response = await apiClient.patch(`/office-group/${groupId}/tarefas/${tarefaId}`, data);
    return response.data;
  },

  deleteTarefa: async (groupId: string, tarefaId: string): Promise<void> => {
    await apiClient.delete(`/office-group/${groupId}/tarefas/${tarefaId}`);
  },

  // Watcher operations (conditional on backend support)
  addWatcher: async (groupId: string, tarefaId: string, employeeId: string): Promise<void> => {
    await apiClient.post(`/office-group/${groupId}/tarefas/${tarefaId}/watchers`, { employeeId });
  },

  removeWatcher: async (groupId: string, tarefaId: string, employeeId: string): Promise<void> => {
    await apiClient.delete(`/office-group/${groupId}/tarefas/${tarefaId}/watchers/${employeeId}`);
  }
};
