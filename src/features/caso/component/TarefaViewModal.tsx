import React, { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { tarefaService } from '../api/tarefaService';
import { quadroService } from '../api/quadroService';
import { casoService } from '../api/casoService';
import { useToast } from '../../../hooks/useToast';
import { StatusSelector } from './StatusSelector';
import { EmployeeSelector } from './EmployeeSelector';
import { WatchersSection } from './WatchersSection';
import { ConfirmationModal } from './ConfirmationModal';
import type { TarefaDetailResource, StatusTarefaResource, PrioridadeTarefa, CasoDetailResource } from '../api/api-types';

interface TarefaViewModalProps {
  tarefaId: string;
  casoId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void; // Callback to refresh task list after updates
}

export const TarefaViewModal: React.FC<TarefaViewModalProps> = ({
  tarefaId,
  casoId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { user } = useUserContext();
  const toast = useToast();
  
  const [tarefa, setTarefa] = useState<TarefaDetailResource | null>(null);
  const [caso, setCaso] = useState<CasoDetailResource | null>(null);
  const [statusList, setStatusList] = useState<StatusTarefaResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Editable field states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingSolution, setEditingSolution] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempSolution, setTempSolution] = useState('');

  useEffect(() => {
    if (isOpen && tarefaId && casoId) {
      fetchTarefaAndBoard();
    }
  }, [tarefaId, casoId, isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - Close modal or cancel editing
      if (e.key === 'Escape') {
        if (editingTitle) {
          setTempTitle(tarefa?.titulo || '');
          setEditingTitle(false);
        } else if (editingDescription) {
          setTempDescription(tarefa?.descricao || '');
          setEditingDescription(false);
        } else if (editingSolution) {
          setTempSolution(tarefa?.solucaoProposta || '');
          setEditingSolution(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, editingTitle, editingDescription, editingSolution, tarefa, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchTarefaAndBoard = async () => {
    if (!user?.userData?.officeGroupId || !tarefaId || !casoId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [tarefaData, boardData, casoData] = await Promise.all([
        tarefaService.getTarefa(user.userData.officeGroupId, tarefaId),
        quadroService.getQuadroTarefasByCaso(user.userData.officeGroupId, casoId),
        casoService.getCaso(user.userData.officeGroupId, casoId),
      ]);
      
      setTarefa(tarefaData);
      setStatusList(boardData.statusTarefas || []);
      setCaso(casoData);
      setTempTitle(tarefaData.titulo);
      setTempDescription(tarefaData.descricao || '');
      setTempSolution(tarefaData.solucaoProposta || '');
    } catch (error: any) {
      console.error('Error fetching task:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao carregar tarefa';
      setError(errorMessage);
      toast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates: Partial<TarefaDetailResource>) => {
    if (!user?.userData?.officeGroupId || !tarefaId) return;

    // Optimistic update
    const original = tarefa;
    setTarefa(prev => prev ? { ...prev, ...updates } : null);
    
    try {
      setSaving(true);
      await tarefaService.updateTarefa(user.userData.officeGroupId, tarefaId, updates);
      
      // Refetch task to get populated relationships (like colaborador)
      const updatedTarefa = await tarefaService.getTarefa(user.userData.officeGroupId, tarefaId);
      setTarefa(updatedTarefa);
      setTempTitle(updatedTarefa.titulo);
      setTempDescription(updatedTarefa.descricao || '');
      setTempSolution(updatedTarefa.solucaoProposta || '');
      
      toast.success('Sucesso', 'Tarefa atualizada com sucesso');
      onUpdate?.(); // Trigger parent refresh
    } catch (error: any) {
      console.error('Error updating task:', error);
      // Rollback on error
      setTarefa(original);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar tarefa';
      toast.error('Erro', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim() && tempTitle !== tarefa?.titulo) {
      handleUpdate({ titulo: tempTitle.trim() });
    }
    setEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (tempDescription !== tarefa?.descricao) {
      handleUpdate({ descricao: tempDescription || undefined });
    }
    setEditingDescription(false);
  };

  const handleSaveSolution = () => {
    if (tempSolution !== tarefa?.solucaoProposta) {
      handleUpdate({ solucaoProposta: tempSolution || undefined });
    }
    setEditingSolution(false);
  };

  const handleDeleteTask = useCallback(async () => {
    if (!user?.userData?.officeGroupId || !tarefaId) return;

    try {
      setSaving(true);
      await tarefaService.deleteTarefa(user.userData.officeGroupId, tarefaId);
      toast.success('Sucesso', 'Tarefa excluída com sucesso');
      onUpdate?.(); // Trigger parent refresh
      onClose(); // Close modal
    } catch (error: any) {
      console.error('Error deleting task:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao excluir tarefa';
      toast.error('Erro', errorMessage);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [user?.userData?.officeGroupId, tarefaId, toast, onUpdate, onClose]);

  const handleAddWatcher = async (employeeId: string) => {
    if (!user?.userData?.officeGroupId || !tarefaId) return;

    const original = tarefa;
    setTarefa(prev => prev ? {
      ...prev,
      watchers: [...(prev.watchers || []), employeeId],
    } : null);

    try {
      await tarefaService.addWatcher(user.userData.officeGroupId, tarefaId, employeeId);
      toast.success('Sucesso', 'Observador adicionado');
    } catch (error: any) {
      console.error('Error adding watcher:', error);
      setTarefa(original);
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar observador';
      toast.error('Erro', errorMessage);
    }
  };

  const handleRemoveWatcher = async (employeeId: string) => {
    if (!user?.userData?.officeGroupId || !tarefaId) return;

    const original = tarefa;
    setTarefa(prev => prev ? {
      ...prev,
      watchers: (prev.watchers || []).filter(id => id !== employeeId),
    } : null);

    try {
      await tarefaService.removeWatcher(user.userData.officeGroupId, tarefaId, employeeId);
      toast.success('Sucesso', 'Observador removido');
    } catch (error: any) {
      console.error('Error removing watcher:', error);
      setTarefa(original);
      const errorMessage = error.response?.data?.message || 'Erro ao remover observador';
      toast.error('Erro', errorMessage);
    }
  };

  const handleToggleSelfWatch = () => {
    toast.error('Erro', 'ID do usuário não disponível');
  };

  const getPriorityColor = (priority?: PrioridadeTarefa) => {
    switch (priority) {
      case 'BAIXA':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
      case 'MEDIA':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100';
      case 'ALTA':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100';
      case 'URGENTE':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const getPriorityLabel = (priority?: PrioridadeTarefa) => {
    switch (priority) {
      case 'BAIXA': return 'Baixa';
      case 'MEDIA': return 'Média';
      case 'ALTA': return 'Alta';
      case 'URGENTE': return 'Urgente';
      default: return 'Não definida';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  const currentStatus = statusList.find(s => s.id === tarefa?.statusId);

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-9998 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-9999 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-white dark:bg-boxdark rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-stroke dark:border-strokedark">
              <div className="flex-1 mr-4">
                {editingTitle ? (
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveTitle();
                      }
                    }}
                    autoFocus
                    className="w-full text-xl font-bold text-black dark:text-white bg-transparent border-b-2 border-primary focus:outline-none"
                    disabled={saving}
                    placeholder="Digite o título da tarefa"
                  />
                ) : (
                  <h2
                    className="text-xl font-bold text-black dark:text-white cursor-pointer hover:text-primary transition-colors"
                    onClick={() => !loading && !error && setEditingTitle(true)}
                    title="Clique para editar"
                  >
                    {loading ? 'Carregando...' : tarefa?.titulo || 'Sem título'}
                  </h2>
                )}
                {!loading && !error && (
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <p className="text-sm text-bodydark">
                      ID: #{tarefaId?.slice(0, 8)}
                    </p>
                    {currentStatus && (
                      <span
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium"
                        style={{ 
                          backgroundColor: currentStatus.cor ? `${currentStatus.cor}20` : '#e5e7eb',
                          color: currentStatus.cor || '#6b7280'
                        }}
                      >
                        {currentStatus.nome}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${getPriorityColor(tarefa?.prioridade)}`}>
                      {getPriorityLabel(tarefa?.prioridade)}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Fechar modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
              ) : error || !tarefa ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-xl font-semibold text-black dark:text-white mb-2">
                    {error || 'Tarefa não encontrada'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Main Content - 2/3 width */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <h3 className="font-semibold text-black dark:text-white">
                          Descrição
                        </h3>
                      </div>
                      <div className="p-6">
                        {editingDescription ? (
                          <div>
                            <textarea
                              value={tempDescription}
                              onChange={(e) => setTempDescription(e.target.value)}
                              onBlur={handleSaveDescription}
                              rows={6}
                              className="w-full rounded border border-stroke bg-white dark:bg-boxdark px-4 py-3 text-black dark:text-white outline-none focus:border-primary"
                              placeholder="Descreva a tarefa..."
                              disabled={saving}
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={handleSaveDescription}
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={() => {
                                  setTempDescription(tarefa.descricao || '');
                                  setEditingDescription(false);
                                }}
                                className="inline-flex items-center justify-center rounded border border-stroke px-4 py-2 text-sm font-medium hover:shadow-1"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => setEditingDescription(true)}
                            className="min-h-[100px] cursor-pointer rounded border border-transparent p-2 hover:border-stroke hover:bg-white dark:hover:bg-boxdark transition-colors"
                            title="Clique para editar"
                          >
                            {tarefa.descricao ? (
                              <p className="text-black dark:text-white whitespace-pre-wrap">{tarefa.descricao}</p>
                            ) : (
                              <p className="text-bodydark italic">Clique para adicionar uma descrição...</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Solution Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <h3 className="font-semibold text-black dark:text-white">
                          Solução Proposta
                        </h3>
                      </div>
                      <div className="p-6">
                        {editingSolution ? (
                          <div>
                            <textarea
                              value={tempSolution}
                              onChange={(e) => setTempSolution(e.target.value)}
                              onBlur={handleSaveSolution}
                              rows={6}
                              className="w-full rounded border border-stroke bg-white dark:bg-boxdark px-4 py-3 text-black dark:text-white outline-none focus:border-primary"
                              placeholder="Descreva a solução proposta..."
                              disabled={saving}
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={handleSaveSolution}
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={() => {
                                  setTempSolution(tarefa.solucaoProposta || '');
                                  setEditingSolution(false);
                                }}
                                className="inline-flex items-center justify-center rounded border border-stroke px-4 py-2 text-sm font-medium hover:shadow-1"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => setEditingSolution(true)}
                            className="min-h-[100px] cursor-pointer rounded border border-transparent p-2 hover:border-stroke hover:bg-white dark:hover:bg-boxdark transition-colors"
                            title="Clique para editar"
                          >
                            {tarefa.solucaoProposta ? (
                              <p className="text-black dark:text-white whitespace-pre-wrap">{tarefa.solucaoProposta}</p>
                            ) : (
                              <p className="text-bodydark italic">Clique para adicionar uma solução...</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - 1/3 width */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Status Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="p-6">
                        <StatusSelector
                          statusList={statusList}
                          currentStatusId={tarefa.statusId}
                          onChange={(statusId) => handleUpdate({ statusId })}
                          disabled={saving}
                        />
                      </div>
                    </div>

                    {/* Assignee Section */}
                    {caso && (
                      <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                          <h3 className="font-semibold text-black dark:text-white">
                            Responsável
                          </h3>
                        </div>
                        <div className="p-6">
                          <EmployeeSelector
                            value={tarefa.colaboradorId || null}
                            onChange={(colaboradorId) => handleUpdate({ colaboradorId: colaboradorId || undefined })}
                            officeUnitId={caso.officeUnitId}
                            currentUserId={user?.userData?.employeeId}
                            disabled={saving}
                          />
                        </div>
                      </div>
                    )}

                    {/* Priority Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <h3 className="font-semibold text-black dark:text-white">
                          Prioridade
                        </h3>
                      </div>
                      <div className="p-6">
                        <select
                          value={tarefa.prioridade || ''}
                          onChange={(e) => handleUpdate({ prioridade: (e.target.value || undefined) as PrioridadeTarefa })}
                          disabled={saving}
                          className="w-full rounded border border-stroke bg-white dark:bg-boxdark px-4 py-3 text-black dark:text-white outline-none focus:border-primary disabled:opacity-50"
                        >
                          <option value="">Não definida</option>
                          <option value="BAIXA">Baixa</option>
                          <option value="MEDIA">Média</option>
                          <option value="ALTA">Alta</option>
                          <option value="URGENTE">Urgente</option>
                        </select>
                      </div>
                    </div>

                    {/* Due Date Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <h3 className="font-semibold text-black dark:text-white">
                          Prazo
                        </h3>
                      </div>
                      <div className="p-6">
                        <input
                          type="date"
                          value={tarefa.prazo ? tarefa.prazo.split('T')[0] : ''}
                          onChange={(e) => handleUpdate({ prazo: e.target.value || undefined })}
                          disabled={saving}
                          className="w-full rounded border border-stroke bg-white dark:bg-boxdark px-4 py-3 text-black dark:text-white outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Estimated Hours Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <h3 className="font-semibold text-black dark:text-white">
                          Estimativa (horas)
                        </h3>
                      </div>
                      <div className="p-6">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={tarefa.estimativaHoras || ''}
                          onChange={(e) => handleUpdate({ estimativaHoras: e.target.value ? parseFloat(e.target.value) : undefined })}
                          disabled={saving}
                          placeholder="Ex: 2.5"
                          className="w-full rounded border border-stroke bg-white dark:bg-boxdark px-4 py-3 text-black dark:text-white outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Watchers Section */}
                    {caso && (
                      <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                        <div className="p-6">
                          <WatchersSection
                            watchers={tarefa.watchers || []}
                            currentUserId={tarefa.colaboradorId || ''}
                            officeUnitId={caso.officeUnitId}
                            onAddWatcher={handleAddWatcher}
                            onRemoveWatcher={handleRemoveWatcher}
                            onToggleSelfWatch={handleToggleSelfWatch}
                            disabled={saving}
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata Section */}
                    <div className="rounded-sm border border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <h3 className="font-semibold text-black dark:text-white">
                          Informações
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        <div>
                          <p className="text-sm text-bodydark mb-1">Criada em</p>
                          <p className="text-sm font-medium text-black dark:text-white">
                            {formatDate(tarefa.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-bodydark mb-1">Última atualização</p>
                          <p className="text-sm font-medium text-black dark:text-white">
                            {formatDate(tarefa.updatedAt)}
                          </p>
                        </div>
                        {tarefa.colaboradorId && (
                          <div>
                            <p className="text-sm text-bodydark mb-1">Responsável</p>
                            {tarefa.colaborador ? (
                              <>
                                <p className="text-sm font-medium text-black dark:text-white">
                                  {tarefa.colaborador.nome}
                                </p>
                                <p className="text-xs text-bodydark">
                                  {tarefa.colaborador.email}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm font-medium text-black dark:text-white">
                                ID: {tarefa.colaboradorId.slice(0, 8)}...
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!loading && !error && tarefa && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-stroke dark:border-strokedark">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"/>
                  </svg>
                  Excluir
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* Saving Indicator */}
            {saving && (
              <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                <span>Salvando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Excluir tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita e todos os dados serão perdidos permanentemente."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteTask}
        onCancel={() => setShowDeleteConfirm(false)}
        isDangerous={true}
      />
    </>
  );
};
