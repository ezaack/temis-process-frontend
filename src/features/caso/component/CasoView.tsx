import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import { casoService } from '../api/casoService';
import type { CasoDetailResource } from '../api/api-types';
import toast from 'react-hot-toast';

// Lazy-load tab components
const CasoTab = lazy(() => import('./CasoTab'));
const TarefasTab = lazy(() => import('./TarefasTab'));

type TabType = 'caso' | 'tarefas';

export const CasoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [caso, setCaso] = useState<CasoDetailResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('caso');

  useEffect(() => {
    const fetchCaso = async () => {
      if (!id || !user?.userData?.officeGroupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await casoService.getCaso(user.userData.officeGroupId, id);
        setCaso(data);
      } catch (error: any) {
        console.error('Error fetching caso:', error);
        const errorMessage = error.response?.data?.message || 'Erro ao carregar detalhes do caso';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCaso();
  }, [id, user?.userData?.officeGroupId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-bodydark">Carregando detalhes do caso...</p>
        </div>
      </div>
    );
  }

  if (error || !caso) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Erro
          </h2>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-black dark:text-white mb-2">
            {error || 'Caso não encontrado'}
          </p>
          <p className="text-bodydark mb-6">
            O caso que você está procurando não existe ou você não tem permissão para visualizá-lo.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/casos')}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
            >
              ← Voltar para lista
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2.5 text-center font-medium text-primary hover:bg-opacity-90"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" to="/casos">
                Casos /
              </Link>
            </li>
            <li className="font-medium text-primary">{caso.titulo}</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-title-xl2 font-bold text-black dark:text-white">
            {caso.titulo}
          </h1>
          <p className="mt-2 text-sm text-bodydark">
            ID: #{id?.slice(0, 8)}
          </p>
        </div>
        <button
          onClick={() => navigate(`/caso-form/${id}`)}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-white hover:bg-opacity-90 sm:px-6 sm:text-base"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Editar Caso
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-stroke dark:border-strokedark">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide sm:gap-2">
            <button
              onClick={() => setActiveTab('caso')}
              className={`
                flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors sm:px-6 sm:py-4
                ${
                  activeTab === 'caso'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-bodydark hover:text-primary'
                }
              `}
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Caso
            </button>
            <button
              onClick={() => setActiveTab('tarefas')}
              className={`
                flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors sm:px-6 sm:py-4
                ${
                  activeTab === 'tarefas'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-bodydark hover:text-primary'
                }
              `}
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
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
              Tarefas
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        }
      >
        {activeTab === 'caso' && (
          <CasoTab 
            caso={caso} 
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'tarefas' && <TarefasTab casoId={id!} />}
      </Suspense>
    </div>
  );
};
