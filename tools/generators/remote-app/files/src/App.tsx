import type { CmsRuntime } from '@cms/platform-contract';
import { RemoteErrorBoundary } from './error-boundary';
import { <%= className %>Page } from './pages';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <<%= className %>Page runtime={runtime} />
    </RemoteErrorBoundary>
  );
}

export default App;
