import type { CSSProperties } from 'react';

/**
 * Base UI types `className`/`style` as `T | ((state) => T)` so consumers can
 * derive styling from component state. This library's public contract is a
 * plain string (via `cn()`, which cannot consume a function), so wrapper
 * components narrow the primitive's props back down with this helper.
 */
export type StringClassName<P> = Omit<P, 'className' | 'style'> & {
  className?: string;
  style?: CSSProperties;
};
