import { useCallback, useEffect, useState } from 'react';
import type { CustomerDetailSectionId } from '../constant';

export const useCustomerDetailSectionNav = (
  sectionIds: readonly CustomerDetailSectionId[],
  stickyOffsetPx: number,
) => {
  const [activeSectionId, setActiveSectionId] =
    useState<CustomerDetailSectionId>(sectionIds[0]);

  useEffect(() => {
    if (stickyOffsetPx <= 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        const nextId = visible[0]?.target.id;
        if (nextId && sectionIds.includes(nextId as CustomerDetailSectionId)) {
          setActiveSectionId(nextId as CustomerDetailSectionId);
        }
      },
      {
        root: null,
        rootMargin: `-${stickyOffsetPx}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, stickyOffsetPx]);

  const scrollToSection = useCallback((sectionId: CustomerDetailSectionId) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return { activeSectionId, scrollToSection };
};
