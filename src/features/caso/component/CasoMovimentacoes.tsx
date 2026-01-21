import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { movimentacaoService, Movimentacao, TipoMovimentacao } from '../api/movimentacoes';
import { useToast } from '../../../hooks/useToast';

interface CasoMovimentacoesProps {
  casoId: string;
}

const CasoMovimentacoes: React.FC<CasoMovimentacoesProps> = ({ casoId }) => {
  const { user } = useUserContext();
  const groupId = user?.userData?.officeGroupId || '';
  const toast = useToast();

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMovimentacoes = async () => {
      if (!groupId || !casoId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await movimentacaoService.getMovimentacoesByCaso(groupId, casoId);
        setMovimentacoes(data);
        if (retryCount > 0) {
          toast.success('Sucesso', 'Movimentações recarregadas');
        }
      } catch (error: any) {
        console.error('Error fetching movimentações:', error);
        const errorMessage = error.response?.data?.message || 'Erro ao carregar movimentações';
        setError(errorMessage);
        if (retryCount === 0) {
          toast.error('Erro', errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovimentacoes();
  }, [groupId, casoId, retryCount]);  // Added retryCount

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Buscando movimentações...');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      toast.warning('Atenção', 'Digite uma movimentação');
      return;
    }

    if (!groupId || !casoId) {
      toast.error('Erro', 'Informações do caso não disponíveis');
      return;
    }

    try {
      setSubmitting(true);

      // Optimistic UI update
      const optimisticMovimentacao: Movimentacao = {
        id: `temp-${Date.now()}`,
        casoId,
        tipo: 'nota',
        texto: inputText.trim(),
        autor: user?.userData?.fullName || 'Você',
        dataHora: new Date().toISOString(),
        editado: false,
      };

      setMovimentacoes(prev => [optimisticMovimentacao, ...prev]);
      setInputText('');

      // Make API call
      const newMovimentacao = await movimentacaoService.createMovimentacao(
        groupId,
        casoId,
        {
          tipo: 'nota',
          texto: inputText.trim(),
        }
      );

      // Replace optimistic with real data
      setMovimentacoes(prev => 
        prev.map(m => m.id === optimisticMovimentacao.id ? newMovimentacao : m)
      );

      toast.success('Sucesso', 'Movimentação adicionada');
    } catch (error: any) {
      console.error('Error creating movimentação:', error);
      
      // Revert optimistic update
      setMovimentacoes(prev => prev.filter(m => !m.id.startsWith('temp-')));
      
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar movimentação';
      toast.error('Erro', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getMovimentacaoIcon = (tipo: TipoMovimentacao) => {
    switch (tipo) {
      case 'atualizacao':
        return (
          <svg className="fill-primary" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3v4m0 0v4m0-4h4m-4 0H6m11 5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'nota':
        return (
          <svg className="fill-bodydark" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7H7m0 3h6m-6 3h6M5 3h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'documento':
        return (
          <svg className="fill-success" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'prazo':
        return (
          <svg className="fill-warning" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'tarefa':
        return (
          <svg className="fill-meta-5" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'sistema':
        return (
          <svg className="fill-meta-1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg className="fill-bodydark" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" strokeWidth="2"/>
          </svg>
        );
    }
  };

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div id="section-movimentacoes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Movimentações e Histórico
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-3 dark:bg-meta-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-gray-3 dark:bg-meta-4"></div>
                  <div className="h-3 w-full rounded bg-gray-3 dark:bg-meta-4"></div>
                  <div className="h-3 w-2/3 rounded bg-gray-3 dark:bg-meta-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="section-movimentacoes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Movimentações e Histórico
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <svg
              className="mb-4 h-16 w-16 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mb-2 text-center text-base font-medium text-black dark:text-white">
              Erro ao carregar movimentações
            </p>
            <p className="mb-4 text-center text-sm text-bodydark">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="section-movimentacoes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-3 dark:border-strokedark sm:px-6 sm:py-4">
        <h3 className="text-base font-semibold text-black dark:text-white sm:text-lg">
          Movimentações e Histórico
        </h3>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Input Section */}
        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-3">
            <label className="mb-2 block text-xs font-medium text-black dark:text-white sm:mb-2.5 sm:text-sm">
              Nova Movimentação
            </label>
            <textarea
              rows={3}
              placeholder="Adicione uma nota, atualização ou comentário..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={submitting}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:px-5 sm:py-3 sm:text-base"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !inputText.trim()}
              className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-center text-xs font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adicionando...
                </>
              ) : (
                <>
                  <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3v10m-5-5h10" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Adicionar
                </>
              )}
            </button>
          </div>
        </form>

        {/* Timeline Section */}
        {movimentacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="mb-4 h-16 w-16 text-bodydark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mb-2 text-base font-medium text-black dark:text-white">
              Nenhuma movimentação registrada
            </p>
            <p className="text-sm text-bodydark">
              Adicione a primeira movimentação para este caso
            </p>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Timeline vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-stroke dark:bg-strokedark" style={{ marginTop: '1.25rem' }}></div>

            {movimentacoes.map((movimentacao) => (
              <div key={movimentacao.id} className="relative flex gap-4">
                {/* Icon */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                  {getMovimentacaoIcon(movimentacao.tipo)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <p className="font-medium text-black dark:text-white">
                      {movimentacao.autor}
                    </p>
                    <span className="text-xs text-bodydark">
                      {formatTimestamp(movimentacao.dataHora)}
                    </span>
                    {movimentacao.editado && (
                      <span className="text-xs italic text-bodydark">
                        (editado)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-bodydark dark:text-bodydark1">
                    {movimentacao.texto}
                  </p>
                  
                  {/* Metadata badges */}
                  {movimentacao.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {movimentacao.metadata.tarefaId && (
                        <span className="inline-flex items-center gap-1 rounded bg-meta-5 bg-opacity-10 px-2 py-0.5 text-xs font-medium text-meta-5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                          </svg>
                          Tarefa
                        </span>
                      )}
                      {movimentacao.metadata.prazoId && (
                        <span className="inline-flex items-center gap-1 rounded bg-warning bg-opacity-10 px-2 py-0.5 text-xs font-medium text-warning">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          Prazo
                        </span>
                      )}
                      {movimentacao.metadata.processoId && (
                        <span className="inline-flex items-center gap-1 rounded bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                          </svg>
                          Processo
                        </span>
                      )}
                      {movimentacao.metadata.arquivoId && (
                        <span className="inline-flex items-center gap-1 rounded bg-success bg-opacity-10 px-2 py-0.5 text-xs font-medium text-success">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"/>
                          </svg>
                          Arquivo
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CasoMovimentacoes;
