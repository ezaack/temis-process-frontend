import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import { casoService } from '../api/casoService';
import type { CasoDetailResource } from '../api/api-types';
import toast from 'react-hot-toast';

// Lazy-load task views
const CasoTaskBoard = lazy(() => import('./CasoTaskBoard').then(m => ({ default: m.CasoTaskBoard })));
const CasoTaskList = lazy(() => import('./CasoTaskList').then(m => ({ default: m.CasoTaskList })));

type TabType = 'board' | 'list';

export const CasoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [caso, setCaso] = useState<CasoDetailResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('board');

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
      <div className="mx-auto max-w-screen-2xl">
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
    <div className="mx-auto max-w-screen-2xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {caso.titulo}
        </h2>

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

      {/* Header with caso metadata */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate('/casos')}
            className="mb-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            ← Voltar para casos
          </button>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {caso.titulo}
          </h2>
        </div>
        <button
          onClick={() => navigate(`/caso-form/${id}`)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
        >
          Editar Caso
        </button>
      </div>

      {/* Metadata cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-3">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 0C8.25 0 6 2.25 6 5C6 7.75 8.25 10 11 10C13.75 10 16 7.75 16 5C16 2.25 13.75 0 11 0ZM11 12C7.13 12 0 13.93 0 17.8V20C0 21.1 0.9 22 2 22H20C21.1 22 22 21.1 22 20V17.8C22 13.93 14.87 12 11 12Z"/>
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium">Clientes</span>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {caso.clientIds?.length || 0}
              </h4>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-3">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.5 3h-11C4.12 3 3 4.12 3 5.5v11C3 17.88 4.12 19 5.5 19h11c1.38 0 2.5-1.12 2.5-2.5v-11C19 4.12 17.88 3 16.5 3zM8 15H6v-2h2v2zm0-3H6v-2h2v2zm0-3H6V7h2v2zm5 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V7h2v2zm3 6h-2v-5h2v5z"/>
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium">Funcionários</span>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {caso.employees?.length || 0}
              </h4>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center gap-3">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 2h-3V0h-2v2H9V0H7v2H4C2.9 2 2 2.9 2 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V7h14v13z"/>
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium">Unidade</span>
              <h4 className="text-sm font-medium text-black dark:text-white">
                {caso.officeUnitId || 'N/A'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {caso.descricao && (
        <div className="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
            Descrição
          </h3>
          <p className="text-bodydark">{caso.descricao}</p>
        </div>
      )}

      {/* Tab navigation */}
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex border-b border-stroke dark:border-strokedark">
          <button
            onClick={() => setActiveTab('board')}
            className={`border-b-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'board'
                ? 'border-primary text-primary'
                : 'border-transparent text-bodydark hover:text-primary'
            }`}
          >
            Quadro Kanban
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`border-b-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-bodydark hover:text-primary'
            }`}
          >
            Lista de Tarefas
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              </div>
            }
          >
            {activeTab === 'board' && <CasoTaskBoard casoId={id!} />}
            {activeTab === 'list' && <CasoTaskList casoId={id!} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};
