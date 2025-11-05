import { ErrorBoundary } from "@ui/components/common/ErrorBoundary";
import { Dashboard } from "@ui/pages/Dashboard";
import { QueryProvider } from "@ui/providers/QueryProvider";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Dashboard />
      </QueryProvider>
    </ErrorBoundary>
  );
};

export { App };
