import { NuqsAdapter } from "nuqs/adapters/react";

import { ErrorBoundary } from "@ui/components/common/ErrorBoundary";
import { Dashboard } from "@ui/pages/Dashboard";
import { QueryProvider } from "@ui/providers/QueryProvider";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <NuqsAdapter>
          <Dashboard />
        </NuqsAdapter>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export { App };
