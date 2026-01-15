import React, { useEffect, useState } from 'react';
import type { CasoDetailResource } from '../api/api-types';
import { employeeService } from '../../employee/api/employee-service';
import { officeService } from '../../office/api/officeService';
import type { OfficeUnitResponse } from '../../office/api/api-types';
import { loggedInUser } from '../../auth/api/authService';
import { useToast } from '../../../hooks/useToast';

interface CasoCoreInfoProps {
  caso: CasoDetailResource;
}

interface EmployeeInfo {
  id: string;
  name: string;
  isResponsible: boolean;
}

// Sub-component: InfoField
interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, priority = 'medium' }) => {
  const labelClasses = {
    high: 'mb-2 block text-sm font-semibold text-black dark:text-white',
    medium: 'mb-2 block text-sm font-medium text-bodydark',
    low: 'mb-2 block text-xs font-normal text-bodydark dark:text-bodydark1',
  };

  const valueClasses = {
    high: 'text-base font-semibold text-black dark:text-white',
    medium: 'text-sm text-black dark:text-white',
    low: 'text-sm text-bodydark',
  };

  return (
    <div>
      <span className={labelClasses[priority]}>{label}</span>
      <div className={valueClasses[priority]}>{value}</div>
    </div>
  );
};

// Sub-component: StatusBadge
interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'success' }) => {
  const variantClasses = {
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    danger: 'bg-danger bg-opacity-10 text-danger',
    info: 'bg-primary bg-opacity-10 text-primary',
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${variantClasses[variant]}`}>
      {status}
    </span>
  );
};

// Sub-component: EmployeeAvatarGroup
interface EmployeeAvatarGroupProps {
  employees: EmployeeInfo[];
  maxVisible?: number;
}

const EmployeeAvatarGroup: React.FC<EmployeeAvatarGroupProps> = ({ employees, maxVisible = 5 }) => {
  const visibleEmployees = employees.slice(0, maxVisible);
  const remainingCount = employees.length - maxVisible;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {visibleEmployees.map((employee, index) => (
          <div
            key={employee.id}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-white dark:border-boxdark"
            title={employee.name}
            style={{ zIndex: visibleEmployees.length - index }}
          >
            <span className="text-xs font-semibold">
              {employee.name.charAt(0).toUpperCase()}
            </span>
            {employee.isResponsible && (
              <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-success dark:border-boxdark" title="Responsável" />
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-bodydark text-white dark:border-boxdark"
            title={`+${remainingCount} mais`}
          >
            <span className="text-xs font-semibold">+{remainingCount}</span>
          </div>
        )}
      </div>
      <div className="text-sm">
        <p className="font-medium text-black dark:text-white">
          {employees.length} {employees.length === 1 ? 'funcionário' : 'funcionários'}
        </p>
        {employees.find(e => e.isResponsible) && (
          <p className="text-xs text-bodydark">
            Responsável: {employees.find(e => e.isResponsible)?.name}
          </p>
        )}
      </div>
    </div>
  );
};

// Main component
const CasoCoreInfo: React.FC<CasoCoreInfoProps> = ({ caso }) => {
  const [employees, setEmployees] = useState<EmployeeInfo[]>([]);
  const [officeUnit, setOfficeUnit] = useState<OfficeUnitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const groupId = loggedInUser?.userData.officeGroupId;
        
        if (!groupId) {
          const errorMsg = 'ID do grupo do escritório não encontrado';
          console.error(errorMsg);
          setError(errorMsg);
          if (retryCount === 0) {
            toast.error('Erro de Autenticação', errorMsg);
          }
          setLoading(false);
          return;
        }

        // Fetch office unit
        if (caso.officeUnitId) {
          try {
            const unitResponse = await officeService.searchUnits(groupId, {
              pageIndex: 0,
              pageSize: 100,
              example: { name: null, registrationNumber: null, contacts: [], addresses: [] }
            });
            
            const unit = unitResponse.content.find(u => u.id === caso.officeUnitId);
            if (unit) {
              setOfficeUnit(unit);
            }
          } catch (error) {
            console.error('Error fetching office unit:', error);
            if (retryCount === 0) {
              toast.warning('Atenção', 'Não foi possível carregar informações da unidade');
            }
          }
        }

        // Fetch employees
        if (caso.employees && caso.employees.length > 0) {
          try {
            const employeeResponse = await employeeService.search({
              pageIndex: 0,
              pageSize: 100,
              example: {}
            });

            const employeeInfos: EmployeeInfo[] = caso.employees
              .map(emp => {
                const employeeData = employeeResponse.content?.find(
                  (e: any) => e.id === emp.employeeId
                );
                
                return employeeData ? {
                  id: emp.employeeId,
                  name: employeeData.employee?.personalData?.name || 
                        employeeData.personalData?.name || 
                        `Funcionário ${emp.employeeId.slice(0, 8)}`,
                  isResponsible: emp.assigned || false,
                } : null;
              })
              .filter((e): e is EmployeeInfo => e !== null);

            if (employeeInfos.length > 0) {
              setEmployees(employeeInfos);
            } else {
              // Fallback: show employee IDs
              const fallbackEmployees: EmployeeInfo[] = caso.employees.map(emp => ({
                id: emp.employeeId,
                name: `Funcionário ${emp.employeeId.slice(0, 8)}`,
                isResponsible: emp.assigned || false,
              }));
              setEmployees(fallbackEmployees);
            }
          } catch (error) {
            console.error('Error fetching employees:', error);
            if (retryCount === 0) {
              toast.warning('Atenção', 'Não foi possível carregar dados completos dos funcionários');
            }
            // Fallback: show employee IDs
            const fallbackEmployees: EmployeeInfo[] = caso.employees.map(emp => ({
              id: emp.employeeId,
              name: `Funcionário ${emp.employeeId.slice(0, 8)}`,
              isResponsible: emp.assigned || false,
            }));
            setEmployees(fallbackEmployees);
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        const errorMsg = 'Erro ao carregar informações do caso';
        setError(errorMsg);
        if (retryCount === 0) {
          toast.error('Erro', errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caso, retryCount]);  // Added retryCount to dependencies

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Buscando informações do caso...');
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Informações do Caso
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-stroke dark:bg-strokedark rounded w-3/4"></div>
            <div className="h-4 bg-stroke dark:bg-strokedark rounded w-1/2"></div>
            <div className="h-4 bg-stroke dark:bg-strokedark rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Informações do Caso
          </h3>
        </div>
        <div className="p-6">
          <div className="rounded-lg border border-danger bg-danger bg-opacity-10 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 fill-danger" viewBox="0 0 20 20">
                <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-danger mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-4 py-2 text-center text-sm font-medium text-white hover:bg-opacity-90"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const responsibleEmployee = employees.find(e => e.isResponsible);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-3 dark:border-strokedark sm:px-6 sm:py-4">
        <h3 className="text-base font-semibold text-black dark:text-white sm:text-lg">
          Informações do Caso
        </h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {/* Status */}
          <InfoField
            label="Status"
            value={<StatusBadge status="Ativo" variant="success" />}
            priority="high"
          />

          {/* Responsável */}
          <InfoField
            label="Responsável"
            value={
              responsibleEmployee ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <span className="text-xs font-semibold">
                      {responsibleEmployee.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{responsibleEmployee.name}</span>
                </div>
              ) : (
                <span className="text-bodydark">Não atribuído</span>
              )
            }
            priority="high"
          />

          {/* Unidade */}
          <InfoField
            label="Unidade"
            value={
              officeUnit ? (
                <span>{officeUnit.officeUnitData.name || 'Sem nome'}</span>
              ) : (
                <span className="text-bodydark">Não especificada</span>
              )
            }
            priority="medium"
          />

          {/* ID do Caso */}
          <InfoField
            label="ID do Caso"
            value={
              <span className="font-mono text-xs">{caso.id.slice(0, 13)}...</span>
            }
            priority="low"
          />

          {/* Quadro de Tarefas ID */}
          <InfoField
            label="Quadro de Tarefas"
            value={
              <span className="font-mono text-xs">
                {caso.quadroTarefasId ? caso.quadroTarefasId.slice(0, 13) + '...' : 'N/A'}
              </span>
            }
            priority="low"
          />
        </div>

        {/* Equipe - Full width section */}
        {employees.length > 0 && (
          <div className="mt-6 border-t border-stroke pt-6 dark:border-strokedark">
            <InfoField
              label="Equipe"
              value={<EmployeeAvatarGroup employees={employees} maxVisible={5} />}
              priority="medium"
            />
          </div>
        )}

        {/* Additional metadata if needed */}
        <div className="mt-6 border-t border-stroke pt-6 dark:border-strokedark">
          <div className="grid grid-cols-2 gap-4 text-xs text-bodydark">
            <div>
              <span className="font-medium">Clientes vinculados:</span> {caso.clientIds?.length || 0}
            </div>
            <div>
              <span className="font-medium">Funcionários:</span> {employees.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasoCoreInfo;
