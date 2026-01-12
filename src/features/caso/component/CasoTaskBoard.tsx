import React from 'react';

interface CasoTaskBoardProps {
  casoId: string;
}

export const CasoTaskBoard: React.FC<CasoTaskBoardProps> = ({ casoId }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <p className="text-bodydark">
        Kanban board para o caso {casoId} será implementado na Fase 5.
      </p>
    </div>
  );
};
