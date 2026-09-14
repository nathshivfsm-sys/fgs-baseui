import { useId } from 'react';
import { SectionTitle } from '@cms/ui';
import type { FormSectionProps } from '../../types';

/** A titled two-column group inside the General Info card. */
export const FormSection = ({ children, title }: FormSectionProps) => {
  const titleId = useId();
  return (
    // `gap`, not `space-y`: Tailwind v4's `space-y` margin sits in a zero-specificity
    // `:where()` and loses to `SectionTitle`'s own `m-0`.
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <SectionTitle id={titleId} size="sm">
        {title}
      </SectionTitle>
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
};
