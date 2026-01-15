import React, { useState, lazy, Suspense } from 'react';
import useLocalStorage from '../../../hooks/useLocalStorage';

// Lazy-load task views
const CasoTaskBoard = lazy(() => import('./CasoTaskBoard').then(m => ({ default: m.CasoTaskBoard })));
const CasoTaskList = lazy(() => import('./CasoTaskList').then(m => ({ default: m.CasoTaskList })));

interface CasoTarefasTabProps {
  casoId: string;
}

type TaskViewType = 'board' | 'list';

/**
 * CasoTarefasTab - Wrapper component for task management views
 * 
 * Features:
 * - View toggle between Kanban board and list view
 * - View state persistence in localStorage
 * - Lazy loading of view components
 * - "Nova Tarefa" action button
 * - Responsive design
 */
const CasoTarefasTab: React.FC<CasoTarefasTabProps> = ({ casoId }) => {
  // Persist view preference in localStorage with casoId as part of the key
  const [activeView, setActiveView] = useLocalStorage<TaskViewType>(
    `caso-${casoId}-tarefas-view`,
    'board'
  );

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleCreateTask = () => {
    setIsCreatingTask(true);
    // TODO: Open task creation modal/form
    // For now, just toggle the state
    setTimeout(() => setIsCreatingTask(false), 100);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* View Toggle Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('board')}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-all duration-200
              ${
                activeView === 'board'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-bodydark hover:bg-gray-2 dark:bg-boxdark dark:text-bodydark dark:hover:bg-meta-4 border border-stroke dark:border-strokedark'
              }
            `}
            aria-pressed={activeView === 'board'}
            aria-label="Visualizar tarefas em quadro Kanban"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span className="hidden sm:inline">Quadro Kanban</span>
            <span className="sm:hidden">Quadro</span>
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-all duration-200
              ${
                activeView === 'list'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-bodydark hover:bg-gray-2 dark:bg-boxdark dark:text-bodydark dark:hover:bg-meta-4 border border-stroke dark:border-strokedark'
              }
            `}
            aria-pressed={activeView === 'list'}
            aria-label="Visualizar tarefas em lista"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>

        {/* Nova Tarefa Button */}
        <button
          onClick={handleCreateTask}
          disabled={isCreatingTask}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Criar nova tarefa"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
          <span className="hidden sm:inline">Nova Tarefa</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>

      {/* View Content */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto"></div>
                <p className="mt-4 text-sm text-bodydark">
                  Carregando {activeView === 'board' ? 'quadro' : 'lista'} de tarefas...
                </p>
              </div>
            </div>
          }
        >
          {activeView === 'board' && (
            <div className="p-4 md:p-6">
              <CasoTaskBoard casoId={casoId} />
            </div>
          )}
          {activeView === 'list' && (
            <div className="p-4 md:p-6">
              <CasoTaskList casoId={casoId} />
            </div>
          )}
        </Suspense>
      </div>

      {/* Help Text - Hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block">
        <div className="rounded-lg bg-gray-2 dark:bg-meta-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="fill-current text-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-bodydark dark:text-bodydark">
                <span className="font-semibold">Dica:</span> {activeView === 'board' 
                  ? 'Use o quadro Kanban para visualizar o fluxo de trabalho e arrastar tarefas entre status. Ideal para gerenciamento visual do progresso.'
                  : 'Use a lista para análise detalhada, filtros avançados e operações em massa. Perfeito para relatórios e comparações.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasoTarefasTab;
