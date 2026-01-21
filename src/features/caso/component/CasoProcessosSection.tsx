import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { processoService, ProcessoSummary, StatusProcesso } from '../api/processos';
import { Link } from 'react-router-dom';
import { useToast } from '../../../hooks/useToast';

interface CasoProcessosSectionProps {
  casoId: string;
}

const CasoProcessosSection: React.FC<CasoProcessosSectionProps> = ({ casoId }) => {
  const { user } = useUserContext();
  const groupId = user?.userData?.officeGroupId || '';
  const toast = useToast();

  const [processos, setProcessos] = useState<ProcessoSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchProcessos = async () => {
      if (!groupId || !casoId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await processoService.getProcessosByCaso(groupId, casoId);
        setProcessos(data);
        if (retryCount > 0) {
          toast.success('Sucesso', 'Processos recarregados');
        }
      } catch (err: any) {
        console.error('Error fetching processos:', err);
        const errorMsg = 'Erro ao carregar processos vinculados';
        setError(errorMsg);
        if (retryCount === 0) {
          toast.error('Erro', errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, [groupId, casoId, retryCount]);  // Added retryCount

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Buscando processos vinculados...');
  };

  const getStatusVariant = (status: StatusProcesso): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'em_andamento':
        return 'info';
      case 'aguardando_citacao':
        return 'warning';
      case 'suspenso':
        return 'warning';
      case 'arquivado':
        return 'danger';
      case 'concluido':
        return 'success';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: StatusProcesso): string => {
    switch (status) {
      case 'em_andamento':
        return 'Em Andamento';
      case 'aguardando_citacao':
        return 'Aguardando Citação';
      case 'suspenso':
        return 'Suspenso';
      case 'arquivado':
        return 'Arquivado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">Processos Vinculados</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">Processos Vinculados</h3>
        </div>
        <div className="p-6">
          <div className="rounded-lg border border-danger bg-danger bg-opacity-10 p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-6 w-6 flex-shrink-0 fill-danger"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-danger mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-4 py-2 text-center text-sm font-medium text-white hover:bg-opacity-90"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processos.length === 0) {
    return (
      <div id="section-processos" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">Processos Vinculados</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
              <svg
                className="fill-bodydark dark:fill-bodydark1"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 4H10a4 4 0 00-4 4v16a4 4 0 004 4h12a4 4 0 004-4V8a4 4 0 00-4-4zm2 20a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v16z" />
                <path d="M12 12h8v2h-8zm0 4h8v2h-8zm0 4h5v2h-5z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Nenhum processo vinculado
            </h4>
            <p className="mb-4 text-sm text-bodydark">
              Vincule processos judiciais para acompanhar movimentações e prazos
            </p>
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-opacity-90">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 4a1 1 0 011 1v2h2a1 1 0 110 2H9v2a1 1 0 11-2 0V9H5a1 1 0 110-2h2V5a1 1 0 011-1z" />
              </svg>
              Vincular Processo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="section-processos" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black dark:text-white">Processos Vinculados</h3>
          <span className="rounded-full bg-primary bg-opacity-10 px-3 py-1 text-sm font-medium text-primary">
            {processos.length} {processos.length === 1 ? 'processo' : 'processos'}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {processos.map((processo) => (
            <div
              key={processo.id}
              className="rounded-lg border border-stroke bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-strokedark dark:bg-boxdark sm:p-4"
            >
              {/* Header: Número do Processo + Status */}
              <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-black dark:text-white sm:text-base">
                    {processo.numero}
                  </h4>
                  <p className="text-xs text-bodydark sm:text-sm">{processo.tipo}</p>
                </div>
                <StatusBadge status={processo.status} variant={getStatusVariant(processo.status)} />
              </div>

              {/* Processo Details Grid */}
              <div className="mb-2 grid grid-cols-1 gap-2 sm:mb-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                <div>
                  <span className="mb-1 block text-xs font-medium text-bodydark">Vara</span>
                  <span className="text-sm text-black dark:text-white">{processo.vara}</span>
                </div>
                <div>
                  <span className="mb-1 block text-xs font-medium text-bodydark">Comarca</span>
                  <span className="text-sm text-black dark:text-white">
                    {processo.comarca} - {processo.uf}
                  </span>
                </div>
                <div>
                  <span className="mb-1 block text-xs font-medium text-bodydark">Distribuição</span>
                  <span className="text-sm text-black dark:text-white">
                    {formatDate(processo.dataDistribuicao)}
                  </span>
                </div>
                {processo.valor && (
                  <div>
                    <span className="mb-1 block text-xs font-medium text-bodydark">Valor da Causa</span>
                    <span className="text-sm font-semibold text-black dark:text-white">
                      {formatCurrency(processo.valor)}
                    </span>
                  </div>
                )}
              </div>

              {/* Partes */}
              <div className="mb-3 space-y-2">
                <div>
                  <span className="text-xs font-medium text-bodydark">Parte Autora: </span>
                  <span className="text-sm text-black dark:text-white">{processo.parteAutora}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-bodydark">Parte Ré: </span>
                  <span className="text-sm text-black dark:text-white">{processo.parteRe}</span>
                </div>
              </div>

              {/* Última Movimentação */}
              {processo.ultimaMovimentacao && processo.ultimaMovimentacaoTexto && (
                <div className="mb-2 rounded-lg bg-gray-2 p-2 dark:bg-meta-4 sm:mb-3 sm:p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <svg
                      className="h-4 w-4 fill-bodydark"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
                      <path d="M8.5 4h-1v4.5l3.5 2.1.5-.8-3-1.8V4z" />
                    </svg>
                    <span className="text-xs font-medium text-bodydark">
                      Última movimentação: {formatDate(processo.ultimaMovimentacao)}
                    </span>
                  </div>
                  <p className="text-sm text-black dark:text-white">{processo.ultimaMovimentacaoTexto}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Link
                  to={`/office-group/${groupId}/processo/${processo.id}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md border border-primary px-3 py-2 text-center text-xs font-medium text-primary hover:bg-primary hover:bg-opacity-10 sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <svg
                    className="fill-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  Ver Detalhes
                </Link>
                {processo.link && (
                  <a
                    href={processo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-stroke px-4 py-2 text-center text-sm font-medium text-bodydark hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    <svg
                      className="fill-current"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14 2H9.5L8.8 1.3C8.3.8 7.7.5 7 .5H2C.9.5 0 1.4 0 2.5v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-9.5c0-1.1-.9-2-2-2zM2 13.5v-11c0-.3.2-.5.5-.5H7c.3 0 .5.1.7.3l.8.7H14c.3 0 .5.2.5.5v9.5c0 .3-.2.5-.5.5H2.5c-.3 0-.5-.2-.5-.5z" />
                    </svg>
                    Acessar Tribunal
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Processo Button */}
        <div className="mt-4 flex justify-center">
          <button className="inline-flex items-center justify-center gap-2 rounded-md border border-stroke bg-white px-6 py-2.5 text-center text-sm font-medium text-bodydark hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4">
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 4a1 1 0 011 1v2h2a1 1 0 110 2H9v2a1 1 0 11-2 0V9H5a1 1 0 110-2h2V5a1 1 0 011-1z" />
            </svg>
            Vincular Novo Processo
          </button>
        </div>
      </div>
    </div>
  );
};

// StatusBadge sub-component
interface StatusBadgeProps {
  status: StatusProcesso;
  variant: 'success' | 'warning' | 'danger' | 'info';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const variantClasses = {
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    danger: 'bg-danger bg-opacity-10 text-danger',
    info: 'bg-primary bg-opacity-10 text-primary',
  };

  const getStatusLabel = (status: StatusProcesso): string => {
    switch (status) {
      case 'em_andamento':
        return 'Em Andamento';
      case 'aguardando_citacao':
        return 'Aguardando Citação';
      case 'suspenso':
        return 'Suspenso';
      case 'arquivado':
        return 'Arquivado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default CasoProcessosSection;
