import React from 'react';
import { useParams } from 'react-router-dom';

export const CasoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {isEditMode ? 'Editar Caso' : 'Criar Novo Caso'}
        </h3>
      </div>
      <div className="p-6.5">
        <p className="text-bodydark">
          Formulário de caso será implementado aqui.
          {isEditMode && ` (Editando caso ID: ${id})`}
        </p>
      </div>
    </div>
  );
};
