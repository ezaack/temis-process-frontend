import React from 'react';
import type { CasoDetailResource } from '../api/api-types';
import CasoStatusCards from './CasoStatusCards';
import CasoCoreInfo from './CasoCoreInfo';
import CasoClientesSection from './CasoClientesSection';
import CasoProcessosSection from './CasoProcessosSection';
import CasoPrazosSection from './CasoPrazosSection';
import CasoMovimentacoes from './CasoMovimentacoes';
import CasoArquivos from './CasoArquivos';

interface CasoTabProps {
  caso: CasoDetailResource;
}

/**
 * CasoTab - Main dashboard and workspace for case management
 * 
 * This component serves as both:
 * - A strategic dashboard (overview, metrics, status)
 * - An operational workspace (updates, files, interactions)
 * 
 * Layout structure:
 * 1. Dashboard Section:
 *    - Status Summary Cards (metrics overview)
 *    - Core Information Panel (metadata)
 *    - Descrição (case description)
 *    - Clientes & Partes
 *    - Processos Vinculados
 *    - Próximos Prazos
 * 
 * 2. Workspace Section:
 *    - Movimentações (activity timeline)
 *    - Arquivos (file management)
 */
const CasoTab: React.FC<CasoTabProps> = ({ caso }) => {
  const handleCardClick = (section: 'tarefas' | 'processos' | 'prazos' | 'arquivos') => {
    // Smooth scroll to the corresponding section
    const element = document.getElementById(`section-${section}`);
    if (element) {
      const yOffset = -80; // Account for fixed header if present
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* ============================================ */}
      {/* DASHBOARD SECTION                            */}
      {/* ============================================ */}
      
      <div className="space-y-6 lg:space-y-8">
        {/* Status Summary Cards - High Priority */}
        <section aria-label="Status summary">
          <CasoStatusCards casoId={caso.id} onCardClick={handleCardClick} />
        </section>

        {/* Core Information Panel - High Priority */}
        <section aria-label="Core information">
          <CasoCoreInfo caso={caso} />
        </section>

        {/* Descrição Section - High Priority (if present) */}
        {caso.descricao && (
          <section aria-label="Case description">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-4 py-3 dark:border-strokedark md:px-6 md:py-4">
                <h3 className="text-base font-semibold text-black dark:text-white md:text-lg">
                  Descrição
                </h3>
              </div>
              <div className="p-4 md:p-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-body dark:text-bodydark md:text-base">
                  {caso.descricao}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Clientes & Partes Section - High Priority */}
        <section aria-label="Clientes">
          <CasoClientesSection clientIds={caso.clientIds || []} />
        </section>

        {/* Processos Section - Medium Priority */}
        <section id="section-processos" aria-label="Processos vinculados">
          <CasoProcessosSection casoId={caso.id} />
        </section>

        {/* Prazos Section - Medium Priority */}
        <section id="section-prazos" aria-label="Próximos prazos">
          <CasoPrazosSection casoId={caso.id} />
        </section>
      </div>

      {/* ============================================ */}
      {/* WORKSPACE SECTION                            */}
      {/* ============================================ */}
      
      {/* Visual Separator between Dashboard and Workspace */}
      <div className="my-8 lg:my-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-stroke dark:border-strokedark" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray px-4 text-sm font-medium text-bodydark dark:bg-boxdark-2 dark:text-bodydark">
              Workspace
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:space-y-8">
        {/* Movimentações Section - Workspace Priority */}
        <section aria-label="Movimentações e histórico">
          <CasoMovimentacoes casoId={caso.id} />
        </section>

        {/* Arquivos Section - Workspace Priority */}
        <section id="section-arquivos" aria-label="Arquivos do caso">
          <CasoArquivos casoId={caso.id} />
        </section>
      </div>

      {/* Bottom spacing for better scroll experience */}
      <div className="h-16" aria-hidden="true" />
    </div>
  );
};

export default CasoTab;
