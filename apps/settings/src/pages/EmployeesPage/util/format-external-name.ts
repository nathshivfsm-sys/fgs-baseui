export const formatExternalName = (
  legalFirstName: string | null | undefined,
  legalLastName: string | null | undefined,
): string => {
  const firstName = legalFirstName?.trim();
  const lastName = legalLastName?.trim();
  if (firstName && lastName) {
    return `${firstName.charAt(0).toUpperCase()}. ${lastName}`;
  }
  return lastName || firstName || '—';
};
