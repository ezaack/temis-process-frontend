import React from 'react';
import { useParams } from 'react-router-dom';

export const CasoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Detalhes do Caso
        </h3>
      </div>
      <div className="p-6.5">
        <p className="text-bodydark">
          Detalhes do caso {id} serão exibidos aqui.
        </p>
        <div className="mt-4">
          <p className="text-sm text-bodydark2">
            Abas: Visão Geral | Tarefas (Board/List)
          </p>
        </div>
      </div>
    </div>
  );
};
