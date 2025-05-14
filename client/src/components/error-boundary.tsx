import React from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        // Log to your error tracking service here
        // Example: Sentry.captureException(error);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Oops! Something went wrong
                            </h2>
                            <div className="text-gray-600 mb-6">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={this.handleReset}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Try again
                                </button>
                                <div>
                                    <a
                                        href="/"
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        Return to home page
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook wrapper for React Query error boundary reset
export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <ErrorBoundary onReset={reset}>
            {children}
        </ErrorBoundary>
    );
} 