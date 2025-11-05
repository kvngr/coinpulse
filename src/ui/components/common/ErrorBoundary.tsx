import { Component, type ReactNode, type ErrorInfo } from "react";

import { Button } from "./Button";

type ErrorBoundaryProps = {
  children: ReactNode;
};

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError === true) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
          <div className="max-w-md text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-400">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <Button onClick={this.handleReset}>Reload Application</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
