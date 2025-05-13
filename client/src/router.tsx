import { Switch, Route } from 'wouter';
import { ROUTES } from '@/lib/constants';
import HomePage from '@/pages/home-page';
import AuthPage from '@/pages/auth-page';
import NotFound from '@/pages/not-found';
import { ProtectedRoute } from '@/lib/protected-route';

export default function Router() {
    return (
        <Switch>
            <ProtectedRoute path={ROUTES.home} component={HomePage} />
            <Route path={ROUTES.auth} component={AuthPage} />
            <Route component={NotFound} />
        </Switch>
    );
} 