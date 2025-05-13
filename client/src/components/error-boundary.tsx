import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ERROR_MESSAGES } from '@/lib/constants';

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
        // Log error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    {this.state.error?.message || ERROR_MESSAGES.serverError}
                                </p>
                                <div className="space-y-4">
                                    <Button
                                        onClick={this.handleReset}
                                        variant="default"
                                        className="w-full"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={() => window.location.href = '/'}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Return to Home
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
} 