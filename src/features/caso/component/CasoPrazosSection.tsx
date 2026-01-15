import React, { useState, useEffect } from 'react';
import { prazoService, Prazo, TipoPrazo } from '../api/prazos';
import { useUserContext } from '../../../context/UserContext';
import { useToast } from '../../../hooks/useToast';

interface CasoPrazosSectionProps {
  casoId: string;
}

interface PrazoUrgency {
  level: 'overdue' | 'urgent' | 'soon' | 'upcoming' | 'future';
  daysUntil: number;
  hoursUntil: number;
  label: string;
  badgeClass: string;
  borderClass: string;
  icon: string;
}

// Tipo configuration
const tipoConfig: Record<TipoPrazo, { label: string; icon: string }> = {
  audiencia: { label: 'Audiência', icon: '⚖️' },
  peticao: { label: 'Petição', icon: '📝' },
  recurso: { label: 'Recurso', icon: '📋' },
  manifestacao: { label: 'Manifestação', icon: '💬' },
  outro: { label: 'Outro', icon: '📅' },
};

const CasoPrazosSection: React.FC<CasoPrazosSectionProps> = ({ casoId }) => {
  const { user } = useUserContext();
  const groupId = user?.userData?.officeGroupId || '';
  const toast = useToast();

  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPrazos = async () => {
      if (!groupId || !casoId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await prazoService.getPrazosByCaso(groupId, casoId);
        
        // Filter out completed prazos and sort by date
        const activePrazos = data
          .filter(p => !p.concluido)
          .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
        
        setPrazos(activePrazos);
        if (retryCount > 0) {
          toast.success('Sucesso', 'Prazos recarregados');
        }
      } catch (err: any) {
        console.error('Error fetching prazos:', err);
        const errorMessage = err.response?.data?.message || 'Erro ao carregar prazos';
        setError(errorMessage);
        if (retryCount === 0) {
          toast.error('Erro', errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrazos();
  }, [groupId, casoId, retryCount]);  // Added retryCount

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Buscando prazos...');
  };

  const calculateUrgency = (prazo: Prazo): PrazoUrgency => {
    const now = new Date();
    const deadline = new Date(prazo.dataHora);
    const msUntil = deadline.getTime() - now.getTime();
    const hoursUntil = Math.floor(msUntil / (1000 * 60 * 60));
    const daysUntil = Math.floor(hoursUntil / 24);

    if (daysUntil < 0) {
      return {
        level: 'overdue',
        daysUntil,
        hoursUntil,
        label: 'VENCIDO',
        badgeClass: 'bg-danger bg-opacity-10 text-danger',
        borderClass: 'border-danger',
        icon: '🚨',
      };
    } else if (daysUntil === 0) {
      return {
        level: 'urgent',
        daysUntil,
        hoursUntil,
        label: hoursUntil > 0 ? `HOJE (${hoursUntil}h restantes)` : 'VENCENDO AGORA',
        badgeClass: 'bg-warning bg-opacity-10 text-warning',
        borderClass: 'border-warning',
        icon: '⚠️',
      };
    } else if (daysUntil === 1) {
      return {
        level: 'urgent',
        daysUntil,
        hoursUntil,
        label: 'AMANHÃ',
        badgeClass: 'bg-warning bg-opacity-10 text-warning',
        borderClass: 'border-warning',
        icon: '⚠️',
      };
    } else if (daysUntil <= 3) {
      return {
        level: 'soon',
        daysUntil,
        hoursUntil,
        label: `${daysUntil} dias`,
        badgeClass: 'bg-meta-6 bg-opacity-10 text-meta-6',
        borderClass: 'border-meta-6',
        icon: '🔔',
      };
    } else if (daysUntil <= 7) {
      return {
        level: 'upcoming',
        daysUntil,
        hoursUntil,
        label: `${daysUntil} dias`,
        badgeClass: 'bg-primary bg-opacity-10 text-primary',
        borderClass: 'border-primary',
        icon: '📅',
      };
    } else {
      return {
        level: 'future',
        daysUntil,
        hoursUntil,
        label: `${daysUntil} dias`,
        badgeClass: 'bg-bodydark bg-opacity-10 text-bodydark',
        borderClass: 'border-stroke',
        icon: '📅',
      };
    }
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div
        id="section-prazos"
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">⏰ Próximos Prazos</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
                </div>
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-600"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        id="section-prazos"
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">⏰ Próximos Prazos</h3>
        </div>
        <div className="p-6">
          <div className="rounded-lg border border-danger bg-danger bg-opacity-10 p-4">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 fill-danger"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="mb-1 font-semibold text-danger">Erro ao carregar prazos</h4>
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

  if (prazos.length === 0) {
    return (
      <div
        id="section-prazos"
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-black dark:text-white">⏰ Próximos Prazos</h3>
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
              Adicionar Prazo
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4">
              <svg
                className="h-8 w-8 text-bodydark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Nenhum prazo cadastrado
            </h4>
            <p className="mb-4 text-sm text-bodydark">
              Adicione prazos importantes para este caso para acompanhar datas críticas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="section-prazos"
      className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div className="border-b border-stroke px-4 py-3 dark:border-strokedark sm:px-6 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-black dark:text-white sm:text-lg">⏰ Próximos Prazos</h3>
          <button className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-center text-xs font-medium text-white hover:bg-opacity-90 sm:gap-2 sm:px-4 sm:text-sm">
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
            <span className="hidden sm:inline">Adicionar Prazo</span>
            <span className="sm:hidden">Adicionar</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {prazos.map((prazo) => {
            const urgency = calculateUrgency(prazo);
            const tipo = tipoConfig[prazo.tipo];

            return (
              <div
                key={prazo.id}
                className={`rounded-lg border-l-4 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:bg-boxdark sm:p-4 ${urgency.borderClass}`}
              >
                {/* Header Row */}
                <div className="mb-2 flex items-start justify-between sm:mb-3">
                  <div className="flex flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
                    {/* Urgency Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold sm:gap-1.5 sm:px-3 sm:text-sm ${urgency.badgeClass}`}
                    >
                      <span>{urgency.icon}</span>
                      <span>{urgency.label}</span>
                    </span>

                    {/* Tipo Badge */}
                    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-1 dark:bg-meta-4 sm:px-2">
                      <span>{tipo.icon}</span>
                      <span className="text-xs font-medium text-bodydark dark:text-bodydark1">
                        {tipo.label}
                      </span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      className="text-bodydark hover:text-primary dark:text-bodydark1"
                      title="Editar prazo"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-bodydark hover:text-success dark:text-bodydark1"
                      title="Marcar como concluído"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  {prazo.titulo}
                </h4>

                {/* Description */}
                {prazo.descricao && (
                  <p className="mb-3 text-sm text-bodydark line-clamp-2">{prazo.descricao}</p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-bodydark">
                  {/* Date/Time */}
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">{formatDateTime(prazo.dataHora)}</span>
                  </div>

                  {/* Linked Processo */}
                  {prazo.processoId && (
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Processo vinculado</span>
                    </div>
                  )}

                  {/* Created by */}
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>
                      Criado em {formatDate(prazo.createdAt)} por {prazo.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show completed prazos link */}
        <div className="mt-6 text-center">
          <button className="text-sm text-primary hover:underline">
            Ver prazos concluídos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CasoPrazosSection;
