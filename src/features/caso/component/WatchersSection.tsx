import React, { useState, useEffect, useRef } from 'react';
import { employeeService } from '../../employee/api/employee-service';

interface EmployeeOption {
  id: string;
  name: string;
  email?: string;
  employeeType?: string;
}

interface WatchersSectionProps {
  watchers: string[]; // Array of employee IDs watching this task
  currentUserId: string;
  officeUnitId: string;
  onAddWatcher: (employeeId: string) => void;
  onRemoveWatcher: (employeeId: string) => void;
  onToggleSelfWatch: () => void;
  disabled?: boolean;
}

/**
 * WatchersSection - Manages task watchers (observers)
 * 
 * Features:
 * - List of current watchers with avatars
 * - "Add Watcher" button → opens employee selector
 * - Remove watcher button (X icon)
 * - "Watch this task" / "Unwatch" toggle for current user
 * - Tooltips showing watcher details
 * - Keyboard navigation support
 */
export const WatchersSection: React.FC<WatchersSectionProps> = ({
  watchers,
  currentUserId,
  officeUnitId,
  onAddWatcher,
  onRemoveWatcher,
  onToggleSelfWatch,
  disabled = false,
}) => {
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCurrentUserWatching = watchers.includes(currentUserId);

  useEffect(() => {
    fetchEmployees();
  }, [officeUnitId]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset highlighted index when search term changes
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const fetchEmployees = async () => {
    if (!officeUnitId) {
      setEmployees([]);
      return;
    }

    setLoading(true);
    try {
      const data = await employeeService.listEmployeesByUnit(officeUnitId);
      
      const options: EmployeeOption[] = data.map((emp: any) => ({
        id: emp.id,
        name: emp.employee?.personalData?.displayName || 
              emp.employee?.personalData?.name || 
              'Sem nome',
        email: emp.employee?.personalData?.contacts?.find((c: any) => 
          c.type === 'COMMERCIAL_EMAIL' || c.type === 'EMAIL'
        )?.value,
        employeeType: emp.employee?.employeeType,
      }));
      
      setEmployees(options);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Get employee details for watchers
  const watcherEmployees = watchers
    .map(watcherId => employees.find(emp => emp.id === watcherId))
    .filter((emp): emp is EmployeeOption => emp !== undefined);

  // Filter employees not already watching
  const availableEmployees = employees.filter(
    emp => !watchers.includes(emp.id) &&
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       emp.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddWatcher = (employeeId: string) => {
    onAddWatcher(employeeId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < availableEmployees.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < availableEmployees.length) {
          handleAddWatcher(availableEmployees[highlightedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  const getEmployeeTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      'LAWYER': 'Advogado',
      'INTERN': 'Estagiário',
      'PARALEGAL': 'Paralegal',
      'SECRETARY': 'Secretário',
      'MANAGER': 'Gerente',
    };
    return type ? labels[type] || type : '';
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-black dark:text-white">
          Observadores
        </h3>
        <span className="text-xs text-bodydark">
          {watchers.length} {watchers.length === 1 ? 'pessoa' : 'pessoas'}
        </span>
      </div>

      {/* Toggle Self Watch Button */}
      <button
        type="button"
        onClick={onToggleSelfWatch}
        disabled={disabled}
        className={`
          w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
          transition-colors
          ${isCurrentUserWatching
            ? 'border-primary bg-primary bg-opacity-10 text-primary hover:bg-opacity-20'
            : 'border-stroke bg-white text-bodydark hover:border-primary hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white'
          }
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        `}
      >
        <svg
          className="w-4 h-4"
          fill={isCurrentUserWatching ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        {isCurrentUserWatching ? 'Deixar de observar' : 'Observar esta tarefa'}
      </button>

      {/* Watchers List */}
      {watcherEmployees.length > 0 && (
        <div className="space-y-2">
          {watcherEmployees.map((watcher) => {
            const isCurrentUser = watcher.id === currentUserId;
            
            return (
              <div
                key={watcher.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-2 dark:bg-meta-4 group hover:bg-gray-3 dark:hover:bg-opacity-80 transition-colors"
              >
                {/* Avatar */}
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${isCurrentUser 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-300 text-gray-700 dark:bg-boxdark dark:text-white'
                    }
                  `}
                  title={watcher.name}
                >
                  {watcher.name.charAt(0).toUpperCase()}
                </div>

                {/* Watcher Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">
                    {watcher.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-primary">(Você)</span>
                    )}
                  </p>
                  {watcher.email && (
                    <p className="text-xs text-bodydark truncate">{watcher.email}</p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveWatcher(watcher.id)}
                  disabled={disabled}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                    text-bodydark hover:text-danger hover:bg-danger hover:bg-opacity-10
                    transition-colors opacity-0 group-hover:opacity-100
                    ${disabled ? 'cursor-not-allowed' : ''}
                  `}
                  title="Remover observador"
                  aria-label={`Remover ${watcher.name} dos observadores`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Watcher Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
            transition-colors
            ${disabled
              ? 'border-stroke bg-gray cursor-not-allowed opacity-60'
              : 'border-stroke bg-white text-bodydark hover:border-primary hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar observador
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-stroke rounded-lg shadow-lg dark:bg-boxdark dark:border-strokedark max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-stroke dark:border-strokedark">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar colaborador..."
                autoFocus
                className="w-full px-3 py-2 text-sm border border-stroke rounded-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              />
            </div>

            {/* Employee List */}
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-bodydark">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm">Carregando colaboradores...</p>
                </div>
              ) : availableEmployees.length === 0 ? (
                <div className="p-4 text-center text-bodydark">
                  <p className="text-sm">
                    {searchTerm 
                      ? 'Nenhum colaborador encontrado' 
                      : watchers.length === employees.length
                        ? 'Todos os colaboradores já estão observando'
                        : 'Nenhum colaborador disponível'
                    }
                  </p>
                </div>
              ) : (
                <ul>
                  {availableEmployees.map((employee, index) => {
                    const isCurrentUser = employee.id === currentUserId;
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <li key={employee.id}>
                        <button
                          type="button"
                          onClick={() => handleAddWatcher(employee.id)}
                          className={`
                            w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3
                            ${isHighlighted 
                              ? 'bg-primary bg-opacity-10' 
                              : 'hover:bg-gray-2 dark:hover:bg-meta-4'
                            }
                          `}
                        >
                          {/* Avatar */}
                          <div className={`
                            flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                            ${isCurrentUser 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-200 text-gray-700 dark:bg-meta-4 dark:text-white'
                            }
                          `}>
                            {employee.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Employee Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-black dark:text-white truncate">
                                {employee.name}
                              </p>
                              {isCurrentUser && (
                                <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-primary text-white rounded">
                                  Você
                                </span>
                              )}
                            </div>
                            {employee.email && (
                              <p className="text-xs text-bodydark truncate">{employee.email}</p>
                            )}
                            {employee.employeeType && (
                              <p className="text-xs text-bodydark">
                                {getEmployeeTypeLabel(employee.employeeType)}
                              </p>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-bodydark">
        Observadores serão notificados sobre atualizações nesta tarefa.
      </p>
    </div>
  );
};
