import React, { Component, ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = (): void => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#f7f6f3] text-[#37352f] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-[#e3e2de] shadow-sm space-y-4">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-lg font-bold font-sans text-[#37352f]">
              화면을 불러오는 중 문제가 발생했습니다
            </h2>
            <p className="text-xs text-[#787774] leading-relaxed">
              일시적인 로컬 브라우저 상태 충돌일 수 있습니다. 아래 버튼을 눌러 초기화하고 다시 접속하세요.
            </p>
            {error && (
              <pre className="text-[11px] font-mono text-rose-600 bg-rose-50 p-3 rounded-lg text-left overflow-x-auto max-h-36">
                {error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2383e2] hover:bg-[#1a6cb8] text-white text-xs font-semibold font-sans cursor-pointer transition-colors"
            >
              상태 초기화 및 새로고침
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
