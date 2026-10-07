import type { ComponentType, ReactNode } from 'react';
import { cn, SectionSubheading } from '@cms/ui';

export interface EmployeeFormSectionProps {
  contentClassName?: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}

export const EmployeeFormSection = ({
  children,
  contentClassName,
  icon: Icon,
  title,
}: EmployeeFormSectionProps) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <Icon aria-hidden className="size-3.5 shrink-0 text-action" />
      <SectionSubheading className="text-[11px] font-semibold leading-[16.5px] tracking-[0.08em] text-action">
        {title}
      </SectionSubheading>
    </div>
    <div className={cn('flex flex-col gap-4', contentClassName)}>
      {children}
    </div>
  </section>
);
