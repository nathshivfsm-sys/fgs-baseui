import { Component, Suspense, type ReactNode } from 'react';
import { BodySmall } from '@cms/ui';

export interface ProviderBoundaryProps {
  children: ReactNode;
  name: string;
}

/** Loading and error boundary for a federated route provider. */
export class ProviderBoundary extends Component<
  ProviderBoundaryProps,
  { error: Error | null }
> {
  state = { error: null as Error | null };

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
          <strong>{this.props.name} is unavailable.</strong>
          <BodySmall color="destructive">{this.state.error.message}</BodySmall>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <BodySmall role="status">Loading {this.props.name}…</BodySmall>
        }
      >
        {this.props.children}
      </Suspense>
    );
  }
}
