"use client";

import { Component, ReactNode } from "react";
import { toast } from "sonner";

interface ErrorBoundaryProps {
  children: ReactNode;
  redirect: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      toast.error("Something went wrong, redirecting to projects");
      // Redirect to the specified path
      if (typeof window !== "undefined") {
        const referrer = document.referrer;
        if (referrer) {
          window.location.href = referrer;
        } else {
          window.location.href = this.props.redirect;
        }
      }
      return null;
    }

    return this.props.children;
  }
}
