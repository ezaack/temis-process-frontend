import apiClient from '../../../config/api';
import type {
  QuadroTarefasResource,
  StatusTarefaResource
} from './api-types';

export const quadroService = {
  getQuadroTarefasByCaso: async (groupId: string, casoId: string): Promise<QuadroTarefasResource> => {
    const response = await apiClient.get(`/office-group/${groupId}/quadro-tarefas/caso/${casoId}`);
    return response.data;
  },

  getQuadroTarefas: async (groupId: string, quadroId: string): Promise<QuadroTarefasResource> => {
    const response = await apiClient.get(`/office-group/${groupId}/quadro-tarefas/${quadroId}`);
    return response.data;
  },

  createFromTemplate: async (groupId: string, templateId: string): Promise<QuadroTarefasResource> => {
    const response = await apiClient.post(`/office-group/${groupId}/quadro-tarefas/from-template/${templateId}`);
    return response.data;
  },

  createStatus: async (groupId: string, quadroId: string, data: StatusTarefaResource): Promise<StatusTarefaResource> => {
    const response = await apiClient.post(`/office-group/${groupId}/quadro-tarefas/${quadroId}/status`, data);
    return response.data;
  },

  updateStatus: async (groupId: string, quadroId: string, statusId: string, data: StatusTarefaResource): Promise<StatusTarefaResource> => {
    const response = await apiClient.put(`/office-group/${groupId}/quadro-tarefas/${quadroId}/status/${statusId}`, data);
    return response.data;
  },

  deleteStatus: async (groupId: string, quadroId: string, statusId: string): Promise<void> => {
    await apiClient.delete(`/office-group/${groupId}/quadro-tarefas/${quadroId}/status/${statusId}`);
  },

  reorderStatus: async (groupId: string, quadroId: string, statusId: string, newOrdem: number): Promise<StatusTarefaResource> => {
    const response = await apiClient.patch(`/office-group/${groupId}/quadro-tarefas/${quadroId}/status/${statusId}/reorder`, { newOrdem });
    return response.data;
  }
};
