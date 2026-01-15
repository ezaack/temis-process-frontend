import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../../client/api/clientService';
import type { ClientResponse } from '../../client/api/api-types';
import { ContactType, DocumentType, PersonType } from '../../../components/shared/enums';
import { useToast } from '../../../hooks/useToast';

interface CasoClientesSectionProps {
  clientIds: string[];
}

interface ClientDisplay {
  id: string;
  nome: string;
  tipo: PersonType;
  documento?: string;
  email?: string;
  telefone?: string;
}

const CasoClientesSection: React.FC<CasoClientesSectionProps> = ({ clientIds }) => {
  const [clients, setClients] = useState<ClientDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      if (!clientIds || clientIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all clients in parallel
        const clientPromises = clientIds.map((id) => clientService.fetchById(id));
        const clientResponses = await Promise.all(clientPromises);

        // Transform API response to display format
        const clientDisplays = clientResponses.map((response) => 
          transformClientToDisplay(response)
        );

        setClients(clientDisplays);
        if (retryCount > 0) {
          toast.success('Sucesso', 'Clientes carregados com sucesso');
        }
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        const errorMsg = 'Erro ao carregar clientes';
        setError(errorMsg);
        if (retryCount === 0) {
          toast.error('Erro', errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [clientIds, retryCount]);  // Added retryCount to dependencies

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Buscando informações dos clientes...');
  };

  const transformClientToDisplay = (response: ClientResponse): ClientDisplay => {
    const { id, client } = response;
    const { personalData } = client;

    // Extract contact information
    const emailContact = personalData?.contacts?.find(
      (c) => c.type === ContactType.PERSONAL_EMAIL || c.type === ContactType.WORK_EMAIL
    );
    const phoneContact = personalData?.contacts?.find(
      (c) => 
        c.type === ContactType.PERSONAL_CELL_PHONE || 
        c.type === ContactType.WORK_CELL_PHONE ||
        c.type === ContactType.HOME_PHONE ||
        c.type === ContactType.WORK_PHONE
    );

    // Extract document (CPF or CNPJ)
    const documento = personalData?.personalDocuments?.find(
      (d) => d.type === DocumentType.CPF || d.type === DocumentType.CNPJ
    )?.value || undefined;

    return {
      id,
      nome: personalData?.displayName || personalData?.name || 'Nome não informado',
      tipo: personalData?.personType || PersonType.NATURAL,
      documento,
      email: emailContact?.value || undefined,
      telefone: phoneContact?.value || undefined,
    };
  };

  const formatDocument = (doc: string, tipo: PersonType) => {
    if (!doc) return '';
    
    if (tipo === PersonType.NATURAL && doc.length === 11) {
      // Format CPF: 000.000.000-00
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (tipo === PersonType.LEGAL && doc.length === 14) {
      // Format CNPJ: 00.000.000/0000-00
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return doc;
  };

  const getInitials = (nome: string) => {
    const parts = nome.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (nome: string) => {
    // Generate consistent color based on name
    const colors = [
      'bg-primary',
      'bg-secondary',
      'bg-success',
      'bg-warning',
      'bg-meta-3',
      'bg-meta-5',
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div id="section-clientes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">Clientes</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border border-stroke p-4 dark:border-strokedark animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-gray-3 dark:bg-meta-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-3 dark:bg-meta-4 rounded w-3/4" />
                  <div className="h-3 bg-gray-3 dark:bg-meta-4 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="section-clientes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">Clientes</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-12 w-12 text-danger mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-bodydark mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-opacity-90"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div id="section-clientes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">Clientes</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-12 w-12 text-bodydark mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-bodydark">Nenhum cliente vinculado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="section-clientes" className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black dark:text-white">
            Clientes ({clients.length})
          </h3>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex min-h-[88px] items-center gap-3 rounded-lg border border-stroke p-3 transition-all hover:border-primary hover:shadow-md dark:border-strokedark dark:hover:border-primary sm:gap-4 sm:p-4"
            >
              {/* Avatar */}
              <div className="h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full text-sm font-semibold text-white sm:text-base ${getAvatarColor(
                    client.nome
                  )}`}
                >
                  {getInitials(client.nome)}
                </div>
              </div>

              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-black dark:text-white truncate sm:text-base">
                  {client.nome}
                </h4>
                
                {client.documento && (
                  <p className="text-xs text-bodydark sm:text-sm">
                    {client.tipo === PersonType.NATURAL ? 'CPF' : 'CNPJ'}:{' '}
                    {formatDocument(client.documento, client.tipo)}
                  </p>
                )}
                
                {client.email && (
                  <p className="text-xs text-bodydark truncate" title={client.email}>
                    {client.email}
                  </p>
                )}
                
                {client.telefone && !client.email && (
                  <p className="text-xs text-bodydark">{client.telefone}</p>
                )}
              </div>

              {/* Link to client detail */}
              <Link
                to={`/clients/${client.id}`}
                className="text-primary hover:text-primary/80 transition-colors"
                title="Ver detalhes do cliente"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CasoClientesSection;
