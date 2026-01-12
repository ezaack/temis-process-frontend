import React from 'react';

interface CasoTaskListProps {
  casoId: string;
}

export const CasoTaskList: React.FC<CasoTaskListProps> = ({ casoId }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <p className="text-bodydark">
        Lista de tarefas para o caso {casoId} será implementado na Fase 6.
      </p>
    </div>
  );
};
