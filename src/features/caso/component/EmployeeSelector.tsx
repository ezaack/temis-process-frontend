import React, { useState, useEffect, useRef } from 'react';
import { employeeService } from '../../employee/api/employee-service';
import { useUserContext } from '../../../context/UserContext';

interface EmployeeOption {
  id: string;
  name: string;
  email?: string;
  employeeType?: string;
}

interface EmployeeSelectorProps {
  value: string | null; // Current employee ID
  onChange: (employeeId: string | null) => void;
  disabled?: boolean;
  officeUnitId: string;
  currentUserId?: string;
}

/**
 * EmployeeSelector - Searchable dropdown for selecting an employee
 * 
 * Features:
 * - Searchable dropdown with filtering
 * - Shows employee name, email, and role
 * - Current user highlighted
 * - "Assign to me" quick action
 * - Unassign option
 * - Keyboard navigation support
 */
export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  officeUnitId,
  currentUserId,
}) => {
  const { user } = useUserContext();
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEmployee = employees.find(emp => emp.id === value);

  const handleSelect = (employeeId: string | null) => {
    onChange(employeeId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAssignToMe = () => {
    if (currentUserId) {
      handleSelect(currentUserId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredEmployees.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredEmployees.length) {
          handleSelect(filteredEmployees[highlightedIndex].id);
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
    <div ref={dropdownRef} className="relative w-full">
      {/* Selected Value Display / Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2.5
          text-left transition-colors
          ${disabled 
            ? 'border-stroke bg-gray cursor-not-allowed opacity-60' 
            : 'border-stroke hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20'
          }
          dark:border-strokedark dark:bg-meta-4 dark:text-white
        `}
      >
        <div className="flex-1 min-w-0">
          {selectedEmployee ? (
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {selectedEmployee.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  {selectedEmployee.name}
                  {selectedEmployee.id === currentUserId && (
                    <span className="ml-2 text-xs text-primary">(Você)</span>
                  )}
                </p>
                {selectedEmployee.email && (
                  <p className="text-xs text-bodydark truncate">{selectedEmployee.email}</p>
                )}
              </div>
            </div>
          ) : (
            <span className="text-bodydark">Não atribuído</span>
          )}
        </div>
        <svg
          className={`flex-shrink-0 w-5 h-5 text-bodydark transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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

          {/* Quick Actions */}
          <div className="p-2 border-b border-stroke dark:border-strokedark bg-gray-2 dark:bg-meta-4">
            <div className="flex gap-2">
              {currentUserId && currentUserId !== value && (
                <button
                  type="button"
                  onClick={handleAssignToMe}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary bg-opacity-10 rounded hover:bg-opacity-20 transition-colors"
                >
                  Atribuir para mim
                </button>
              )}
              {value && (
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-bodydark bg-gray-100 rounded hover:bg-gray-200 transition-colors dark:bg-meta-4 dark:hover:bg-opacity-50"
                >
                  Remover atribuição
                </button>
              )}
            </div>
          </div>

          {/* Employee List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-bodydark">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm">Carregando colaboradores...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-4 text-center text-bodydark">
                <p className="text-sm">
                  {searchTerm ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador disponível'}
                </p>
              </div>
            ) : (
              <ul>
                {filteredEmployees.map((employee, index) => {
                  const isSelected = employee.id === value;
                  const isCurrentUser = employee.id === currentUserId;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li key={employee.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(employee.id)}
                        className={`
                          w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3
                          ${isHighlighted 
                            ? 'bg-primary bg-opacity-10' 
                            : 'hover:bg-gray-2 dark:hover:bg-meta-4'
                          }
                          ${isSelected ? 'bg-primary bg-opacity-5' : ''}
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
                            {isSelected && (
                              <svg
                                className="flex-shrink-0 w-4 h-4 text-primary"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
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
  );
};
