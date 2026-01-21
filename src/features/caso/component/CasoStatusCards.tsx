import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { tarefaService } from '../api/tarefaService';
import { processoService } from '../api/processos';
import { prazoService } from '../api/prazos';
import { arquivoService } from '../api/arquivos';
import { useToast } from '../../../hooks/useToast';

interface CasoStatusCardsProps {
  casoId: string;
  onCardClick?: (section: 'tarefas' | 'processos' | 'prazos' | 'arquivos') => void;
}

interface StatusCardData {
  title: string;
  count: number;
  loading: boolean;
  icon: React.ReactNode;
  section: 'tarefas' | 'processos' | 'prazos' | 'arquivos';
}

const CasoStatusCards: React.FC<CasoStatusCardsProps> = ({ casoId, onCardClick }) => {
  const { user } = useUserContext();
  const groupId = user?.userData?.officeGroupId || '';
  const toast = useToast();
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [cards, setCards] = useState<StatusCardData[]>([
    {
      title: 'Tarefas Abertas',
      count: 0,
      loading: true,
      section: 'tarefas',
      icon: (
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: 'Processos Ativos',
      count: 0,
      loading: true,
      section: 'processos',
      icon: (
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      ),
    },
    {
      title: 'Prazos Próximos',
      count: 0,
      loading: true,
      section: 'prazos',
      icon: (
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 0C4.925 0 0 4.925 0 11s4.925 11 11 11 11-4.925 11-11S17.075 0 11 0zm0 20c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9z" />
          <path d="M11.5 5h-1v6.5l5.25 3.15.75-1.23-5-3V5z" />
        </svg>
      ),
    },
    {
      title: 'Arquivos',
      count: 0,
      loading: true,
      section: 'arquivos',
      icon: (
        <svg
          className="fill-primary dark:fill-white"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.5 2.25l5.25 5.25v11a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 014.25 18.5v-15A2.25 2.25 0 016.5 1.25h6z" />
          <path d="M12.5 2.25v5.25h5.25" />
        </svg>
      ),
    },
  ]);

  useEffect(() => {
    if (!groupId || !casoId) return;

    const fetchCounts = async () => {
      let errorCount = 0;
      setHasError(false);

      try {
        // Fetch Tarefas count
        tarefaService
          .getTarefasByCaso(groupId, casoId)
          .then((tarefas) => {
            // Count all tasks (no 'concluida' field in TarefaResource)
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'tarefas'
                  ? { ...card, count: tarefas.length, loading: false }
                  : card
              )
            );
          })
          .catch((err) => {
            console.error('Error fetching tarefas:', err);
            errorCount++;
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'tarefas' ? { ...card, loading: false } : card
              )
            );
          });

        // Fetch Processos count
        processoService
          .getProcessosByCaso(groupId, casoId)
          .then((processos) => {
            const activeCount = processos.filter(
              (p) => p.status === 'em_andamento' || p.status === 'aguardando_citacao'
            ).length;
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'processos'
                  ? { ...card, count: activeCount, loading: false }
                  : card
              )
            );
          })
          .catch((err) => {
            console.error('Error fetching processos:', err);
            errorCount++;
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'processos' ? { ...card, loading: false } : card
              )
            );
          });

        // Fetch Prazos count (upcoming in next 30 days)
        prazoService
          .getPrazosByCaso(groupId, casoId)
          .then((prazos) => {
            const now = new Date();
            const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            const upcomingCount = prazos.filter((p) => {
              if (p.concluido) return false;
              const prazoDate = new Date(p.dataHora);
              return prazoDate >= now && prazoDate <= next30Days;
            }).length;
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'prazos'
                  ? { ...card, count: upcomingCount, loading: false }
                  : card
              )
            );
          })
          .catch((err) => {
            console.error('Error fetching prazos:', err);
            errorCount++;
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'prazos' ? { ...card, loading: false } : card
              )
            );
          });

        // Fetch Arquivos count
        arquivoService
          .getArquivosByCaso(groupId, casoId)
          .then((arquivos) => {
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'arquivos'
                  ? { ...card, count: arquivos.length, loading: false }
                  : card
              )
            );
          })
          .catch((err) => {
            console.error('Error fetching arquivos:', err);
            errorCount++;
            setCards((prev) =>
              prev.map((card) =>
                card.section === 'arquivos' ? { ...card, loading: false } : card
              )
            );
          });

        // Show error toast if any failed
        if (errorCount > 0) {
          setHasError(true);
          if (retryCount === 0) {
            toast.warning(
              'Dados Parcialmente Carregados',
              'Alguns cards podem não exibir informações atualizadas. Clique para tentar novamente.'
            );
          }
        }
      } catch (error) {
        console.error('Error fetching status counts:', error);
        setHasError(true);
        toast.error('Erro', 'Não foi possível carregar os dados dos cards');
      }
    };

    fetchCounts();
  }, [groupId, casoId, retryCount]);  // Added retryCount to dependencies

  const handleCardClick = (section: 'tarefas' | 'processos' | 'prazos' | 'arquivos') => {
    if (onCardClick) {
      onCardClick(section);
    } else {
      // Default behavior: scroll to section
      const element = document.getElementById(`section-${section}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Atualizando informações dos cards...');
  };

  return (
    <div className="space-y-4">
      {hasError && (
        <div className="flex items-center justify-between rounded-md border border-warning bg-warning bg-opacity-10 p-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 fill-warning" viewBox="0 0 20 20">
              <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" />
            </svg>
            <span className="text-sm text-warning">Alguns dados podem estar desatualizados</span>
          </div>
          <button
            onClick={handleRetry}
            className="rounded-md bg-warning px-3 py-1 text-xs font-medium text-white hover:bg-opacity-90"
          >
            Tentar Novamente
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.section}
            onClick={() => handleCardClick(card.section)}
            className="cursor-pointer rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              {card.icon}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                {card.loading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-stroke dark:bg-strokedark" />
                ) : (
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {card.count}
                  </h4>
                )}
                <span className="text-sm font-medium">{card.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasoStatusCards;
