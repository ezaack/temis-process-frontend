import toast from 'react-hot-toast';

/**
 * Custom toast notification hook with consistent styling
 * Provides easy-to-use methods for success, error, warning, and info toasts
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const getToastColor = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return 'bg-[#04b20c]';
    case 'warning':
      return 'bg-[#eab90f]';
    case 'error':
      return 'bg-[#e13f32]';
    case 'info':
      return 'bg-[#3b82f6]';
    default:
      return 'bg-[#04b20c]';
  }
};

const showToast = (
  title: string,
  message: string,
  type: ToastType,
  options: ToastOptions = {}
) => {
  const { duration = 4000, position = 'top-right' } = options;

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full ${getToastColor(type)} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="mt-1 text-sm text-white">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            type="button"
            className="mr-2 box-content rounded-none border-none opacity-100 hover:no-underline hover:opacity-50 focus:opacity-50 focus:shadow-none focus:outline-none text-white"
            aria-label="Close"
          >
            <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    ),
    { duration, position }
  );
};

export const useToast = () => {
  return {
    success: (title: string, message: string, options?: ToastOptions) =>
      showToast(title, message, 'success', options),
    error: (title: string, message: string, options?: ToastOptions) =>
      showToast(title, message, 'error', options),
    warning: (title: string, message: string, options?: ToastOptions) =>
      showToast(title, message, 'warning', options),
    info: (title: string, message: string, options?: ToastOptions) =>
      showToast(title, message, 'info', options),
  };
};
