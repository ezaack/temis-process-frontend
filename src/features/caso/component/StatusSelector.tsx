import React from 'react';
import type { StatusTarefaResource } from '../api/api-types';

interface StatusSelectorProps {
  statusList: StatusTarefaResource[];
  currentStatusId: string;
  onChange: (statusId: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * StatusSelector Component
 * 
 * A dropdown selector for task statuses with color-coded visual indicators.
 * Displays the current status as a badge with its color and allows selection
 * from all available statuses in the board.
 * 
 * Features:
 * - Color-coded status badges
 * - Visual indication of current status
 * - Keyboard navigation support
 * - Dark mode compatible
 * - Accessible with proper labels
 * 
 * @param statusList - Array of available status options
 * @param currentStatusId - ID of the currently selected status
 * @param onChange - Callback fired when status selection changes
 * @param disabled - Whether the selector is disabled
 * @param label - Optional custom label (defaults to "Status")
 * @param className - Additional CSS classes for the container
 */
const StatusSelector: React.FC<StatusSelectorProps> = ({
  statusList,
  currentStatusId,
  onChange,
  disabled = false,
  label = 'Status',
  className = '',
}) => {
  const currentStatus = statusList.find(s => s.id === currentStatusId);

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor="status-selector" 
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>

      {/* Current status display */}
      {currentStatus && (
        <div className="mb-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{
              backgroundColor: currentStatus.cor ? `${currentStatus.cor}20` : '#e5e7eb',
              color: currentStatus.cor || '#6b7280',
              border: `1px solid ${currentStatus.cor || '#d1d5db'}`
            }}
          >
            {currentStatus.cor && (
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: currentStatus.cor }}
                aria-hidden="true"
              />
            )}
            {currentStatus.nome}
          </span>
        </div>
      )}

      {/* Status dropdown selector */}
      <select
        id="status-selector"
        value={currentStatusId}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full rounded-lg border border-stroke bg-transparent px-4 py-3
          text-black outline-none transition focus:border-primary
          active:border-primary disabled:cursor-not-allowed disabled:bg-whiter
          dark:border-form-strokedark dark:bg-form-input dark:text-white
          dark:focus:border-primary
          ${disabled ? 'opacity-50' : ''}
        `}
        aria-label={label}
      >
        {statusList.length === 0 && (
          <option value="">Nenhum status disponível</option>
        )}
        
        {statusList.map(status => (
          <option key={status.id} value={status.id}>
            {status.nome}
            {status.descricao ? ` - ${status.descricao}` : ''}
          </option>
        ))}
      </select>

      {/* Help text */}
      {!disabled && statusList.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Altere o status para mover a tarefa no quadro
        </p>
      )}
    </div>
  );
};

export { StatusSelector };
export type { StatusSelectorProps };
