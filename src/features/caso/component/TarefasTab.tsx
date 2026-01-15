import React from 'react';
import CasoTarefasTab from './CasoTarefasTab';

interface TarefasTabProps {
  casoId: string;
}

/**
 * TarefasTab - Legacy wrapper for backwards compatibility
 * 
 * This component now delegates to CasoTarefasTab which implements
 * the full functionality with view toggle, state persistence, and
 * lazy loading.
 * 
 * @deprecated Consider using CasoTarefasTab directly
 */
const TarefasTab: React.FC<TarefasTabProps> = ({ casoId }) => {
  return <CasoTarefasTab casoId={casoId} />;
};

export default TarefasTab;
