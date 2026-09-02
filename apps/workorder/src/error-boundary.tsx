import { Component, type ReactNode } from 'react';

interface RemoteErrorBoundaryProps {
  children: ReactNode;
}

interface RemoteErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches rendering failures local to this remote so a bug here degrades just this
 * remote's own output — in standalone mode there is no shell-level boundary to fall
 * back on, and even when federated this catches failures the shell's own boundary
 * (which only wraps the lazy-loaded module boundary) would otherwise miss.
 */
export class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  state: RemoteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="rounded-md border border-destructive/30 bg-destructive/5 p-6"
          role="alert"
        >
          <strong>Work orders is unavailable.</strong>
          <p className="text-sm text-destructive">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
