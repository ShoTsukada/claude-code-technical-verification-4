'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** カスタムフォールバック UI（省略時はデフォルトUI） */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // 本番では外部ロギングサービスへ送信する
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-lg
                     border border-error/30 bg-error/5 p-8 text-center"
        >
          <ExclamationCircleIcon
            className="w-10 h-10 text-error"
            aria-hidden="true"
          />
          <div>
            <p className="text-base font-bold leading-[1.7] text-text-body">
              システムエラーが発生しました
            </p>
            <p className="mt-1 text-sm leading-[1.7] text-text-secondary">
              しばらく後に再試行してください
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded px-5 py-2 text-sm font-medium text-white
                       bg-primary hover:bg-primary-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            再試行
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
