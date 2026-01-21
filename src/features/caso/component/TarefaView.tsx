import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import { tarefaService } from '../api/tarefaService';
import { quadroService } from '../api/quadroService';
import { casoService } from '../api/casoService';
import { useToast } from '../../../hooks/useToast';
import { StatusSelector } from './StatusSelector';
import { EmployeeSelector } from './EmployeeSelector';
import { WatchersSection } from './WatchersSection';
import { TarefaViewSkeleton } from './TarefaViewSkeleton';
import { ConfirmationModal } from './ConfirmationModal';
import type { TarefaDetailResource, StatusTarefaResource, PrioridadeTarefa, CasoDetailResource } from '../api/api-types';

export const TarefaView: React.FC = () => {
  const { casoId, tarefaId } = useParams<{ casoId: string; tarefaId: string }>();
  const navigate = useNavigate();
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
    fetchTarefaAndBoard();
  }, [tarefaId, casoId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - Cancel editing mode
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTitle, editingDescription, editingSolution, tarefa]);

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
      toast.success('Sucesso', 'Tarefa atualizada com sucesso');
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
      navigate(`/casos/${casoId}`);
    } catch (error: any) {
      console.error('Error deleting task:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao excluir tarefa';
      toast.error('Erro', errorMessage);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [user?.userData?.officeGroupId, tarefaId, casoId, navigate, toast]);

  const handleAddWatcher = async (employeeId: string) => {
    if (!user?.userData?.officeGroupId || !tarefaId) return;

    // Optimistic update
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

    // Optimistic update
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
    // TODO: Get current user's employee ID from context or state
    // For now, this feature is disabled until we have the current user's employee ID
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

  if (loading) {
    return <TarefaViewSkeleton />;
  }

  if (error || !tarefa) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-black dark:text-white mb-2">
            {error || 'Tarefa não encontrada'}
          </p>
          <p className="text-bodydark mb-6">
            A tarefa que você está procurando não existe ou você não tem permissão para visualizá-la.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/casos/${casoId}`)}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
            >
              ← Voltar para o caso
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = statusList.find(s => s.id === tarefa.statusId);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-col gap-3">
        <nav>
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link className="font-medium hover:text-primary" to="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium hover:text-primary" to="/casos">
                Casos /
              </Link>
            </li>
            <li>
              <Link className="font-medium hover:text-primary" to={`/casos/${casoId}`}>
                {tarefa.caso?.titulo || 'Caso'} /
              </Link>
            </li>
            <li className="font-medium text-primary">Tarefa</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          {editingTitle ? (
            <div className="flex items-center gap-2">
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
                className="w-full text-title-xl2 font-bold text-black dark:text-white bg-transparent border-b-2 border-primary focus:outline-none"
                disabled={saving}
                aria-label="Título da tarefa"
                placeholder="Digite o título da tarefa"
              />
            </div>
          ) : (
            <h1
              className="text-title-xl2 font-bold text-black dark:text-white cursor-pointer hover:text-primary transition-colors"
              onClick={() => setEditingTitle(true)}
              title="Clique para editar"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setEditingTitle(true);
                }
              }}
              aria-label="Título da tarefa, clique para editar"
            >
              {tarefa.titulo}
            </h1>
          )}
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
            <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${getPriorityColor(tarefa.prioridade)}`}>
              {getPriorityLabel(tarefa.prioridade)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={saving}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-red-500 px-4 py-2.5 text-center text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Excluir tarefa"
            aria-label="Excluir tarefa"
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"/>
              <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"/>
              <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"/>
              <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"/>
            </svg>
            <span className="hidden sm:inline">Excluir</span>
          </button>
          <button
            onClick={() => navigate(`/casos/${casoId}`)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Descreva a tarefa..."
                    disabled={saving}
                    aria-label="Descrição da tarefa"
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
                      className="inline-flex items-center justify-center rounded border border-stroke px-4 py-2 text-sm font-medium hover:shadow-1 dark:border-strokedark"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingDescription(true)}
                  className="min-h-[100px] cursor-pointer rounded border border-transparent p-2 hover:border-stroke hover:bg-gray-2 dark:hover:border-strokedark dark:hover:bg-meta-4 transition-colors"
                  title="Clique para editar"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setEditingDescription(true);
                    }
                  }}
                  aria-label="Descrição da tarefa, clique para editar"
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
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Descreva a solução proposta..."
                    disabled={saving}
                    aria-label="Solução proposta"
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
                      className="inline-flex items-center justify-center rounded border border-stroke px-4 py-2 text-sm font-medium hover:shadow-1 dark:border-strokedark"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingSolution(true)}
                  className="min-h-[100px] cursor-pointer rounded border border-transparent p-2 hover:border-stroke hover:bg-gray-2 dark:hover:border-strokedark dark:hover:bg-meta-4 transition-colors"
                  title="Clique para editar"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setEditingSolution(true);
                    }
                  }}
                  aria-label="Solução proposta, clique para editar"
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
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                  currentUserId={undefined}
                  disabled={saving}
                />
              </div>
            </div>
          )}

          {/* Priority Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Prioridade da tarefa"
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
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Prazo da tarefa"
              />
            </div>
          </div>

          {/* Estimated Hours Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Estimativa de horas"
              />
            </div>
          </div>

          {/* Watchers Section */}
          {caso && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
              {tarefa.colaborador && (
                <div>
                  <p className="text-sm text-bodydark mb-1">Responsável</p>
                  <p className="text-sm font-medium text-black dark:text-white">
                    {tarefa.colaborador.nome}
                  </p>
                  <p className="text-xs text-bodydark">
                    {tarefa.colaborador.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saving Indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-9999">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
          <span>Salvando...</span>
        </div>
      )}

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
    </div>
  );
};
