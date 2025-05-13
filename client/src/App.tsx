import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/hooks/use-auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Router from '@/router';
import ErrorBoundary from '@/components/error-boundary';
import SEO from '@/components/seo';
import { APP_CONFIG } from '@/lib/constants';

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <SEO />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <ErrorBoundary>
                    <Router />
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
