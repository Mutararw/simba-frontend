import React from "react";
import { Button } from "@/components/ui/button";

type ErrorBoundaryState = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unexpected application error",
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("Application render error", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The page could not be rendered. Please refresh and try again.
          </p>
          {this.state.message ? (
            <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              {this.state.message}
            </p>
          ) : null}
          <Button className="mt-5 rounded-full" onClick={() => window.location.assign("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }
}
