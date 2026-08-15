import { useId, type ReactNode, type SVGProps } from 'react';

export interface FigmaIconProps
  extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  title?: string;
}

/** Creates a scalable Figma-derived icon with optional accessible title text. */
export function createFigmaIcon(
  displayName: string,
  viewBox: string,
  children: ReactNode,
) {
  function FigmaIcon({ title, ...props }: FigmaIconProps) {
    const titleId = useId();

    return (
      <svg
        aria-hidden={title ? undefined : true}
        aria-labelledby={title ? titleId : undefined}
        fill="none"
        focusable="false"
        height="1em"
        role={title ? 'img' : undefined}
        viewBox={viewBox}
        width="1em"
        {...props}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        {children}
      </svg>
    );
  }

  FigmaIcon.displayName = displayName;
  return FigmaIcon;
}
