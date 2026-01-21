import React, { useState, useEffect } from 'react';
import type { CasoDetailResource } from '../api/api-types';
import CasoCoreInfo from './CasoCoreInfo';
import CasoClientesSection from './CasoClientesSection';
import CasoProcessosSection from './CasoProcessosSection';
import CasoPrazosSection from './CasoPrazosSection';
import CasoMovimentacoes from './CasoMovimentacoes';
import CasoArquivos from './CasoArquivos';
import { useUserContext } from '../../../context/UserContext';
import { tarefaService } from '../api/tarefaService';
import { processoService } from '../api/processos';
import { prazoService } from '../api/prazos';
import { arquivoService } from '../api/arquivos';

interface CasoTabProps {
  caso: CasoDetailResource;
  onNavigateToTab?: (tab: 'tarefas') => void;
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
 *    - Core Information Panel with notification icons (metrics overview)
 *    - Descrição (case description)
 *    - Clientes & Partes
 *    - Processos Vinculados
 *    - Próximos Prazos
 * 
 * 2. Workspace Section:
 *    - Movimentações (activity timeline)
 *    - Arquivos (file management)
 */
const CasoTab: React.FC<CasoTabProps> = ({ caso, onNavigateToTab }) => {
  const { user } = useUserContext();
  const groupId = user?.userData?.officeGroupId || '';
  
  const [statusCounts, setStatusCounts] = useState({
    tarefas: 0,
    processos: 0,
    prazos: 0,
    arquivos: 0,
  });

  useEffect(() => {
    if (!groupId || !caso.id) return;

    const fetchCounts = async () => {
      try {
        // Fetch all counts in parallel
        const [tarefas, processos, prazos, arquivos] = await Promise.allSettled([
          tarefaService.getTarefasByCaso(groupId, caso.id),
          processoService.getProcessosByCaso(groupId, caso.id),
          prazoService.getPrazosByCaso(groupId, caso.id),
          arquivoService.getArquivosByCaso(groupId, caso.id),
        ]);

        const newCounts = { tarefas: 0, processos: 0, prazos: 0, arquivos: 0 };

        // Process tarefas
        if (tarefas.status === 'fulfilled') {
          newCounts.tarefas = tarefas.value.length;
        }

        // Process processos (only active ones)
        if (processos.status === 'fulfilled') {
          newCounts.processos = processos.value.filter(
            (p) => p.status === 'em_andamento' || p.status === 'aguardando_citacao'
          ).length;
        }

        // Process prazos (upcoming in next 30 days)
        if (prazos.status === 'fulfilled') {
          const now = new Date();
          const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          newCounts.prazos = prazos.value.filter((p) => {
            if (p.concluido) return false;
            const prazoDate = new Date(p.dataHora);
            return prazoDate >= now && prazoDate <= next30Days;
          }).length;
        }

        // Process arquivos
        if (arquivos.status === 'fulfilled') {
          newCounts.arquivos = arquivos.value.length;
        }

        setStatusCounts(newCounts);
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };

    fetchCounts();
  }, [groupId, caso.id]);

  const handleCardClick = (section: 'tarefas' | 'processos' | 'prazos' | 'arquivos') => {
    // For tarefas, navigate to the tarefas tab
    if (section === 'tarefas' && onNavigateToTab) {
      onNavigateToTab('tarefas');
      return;
    }

    // For other sections, smooth scroll to the corresponding section
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
        {/* Core Information Panel with Notification Icons - High Priority */}
        <section aria-label="Core information">
          <CasoCoreInfo 
            caso={caso} 
            statusCounts={statusCounts}
            onIconClick={handleCardClick}
          />
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
