import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console (in production, you might want to send this to an error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-boxdark-2">
          <div className="w-full max-w-lg rounded-lg border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger bg-opacity-10">
                <svg
                  className="h-12 w-12 fill-danger"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="mb-3 text-center text-2xl font-bold text-black dark:text-white">
              Algo deu errado
            </h2>

            {/* Error Message */}
            <p className="mb-6 text-center text-base text-bodydark">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página ou entre em contato com o suporte se o problema persistir.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 rounded-lg border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
                <summary className="cursor-pointer font-medium text-black dark:text-white">
                  Detalhes do Erro (apenas em desenvolvimento)
                </summary>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-danger">Mensagem:</p>
                    <p className="text-xs text-bodydark">{this.state.error.message}</p>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <p className="text-sm font-semibold text-danger">Stack Trace:</p>
                      <pre className="mt-1 max-h-60 overflow-auto text-xs text-bodydark">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <p className="text-sm font-semibold text-danger">Component Stack:</p>
                      <pre className="mt-1 max-h-40 overflow-auto text-xs text-bodydark">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-md bg-primary px-6 py-3 text-center font-medium text-white transition hover:bg-opacity-90"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 rounded-md border border-stroke bg-white px-6 py-3 text-center font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
              >
                Ir para Início
              </button>
            </div>

            {/* Support Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-bodydark">
                Precisa de ajuda?{' '}
                <a
                  href="mailto:suporte@exemplo.com"
                  className="font-medium text-primary hover:underline"
                >
                  Entre em contato com o suporte
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
