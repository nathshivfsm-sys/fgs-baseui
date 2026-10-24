const copySuffix = /-COPY(?:-\d+)?$/i;

export const buildCopyRoleCode = (
  roleCode: string | null | undefined,
  existingRoleCodes: readonly (string | null | undefined)[],
) => {
  const base = (roleCode?.trim() || 'ROLE').replace(copySuffix, '');
  const taken = new Set(
    existingRoleCodes
      .map((code) => code?.trim().toLowerCase())
      .filter((code): code is string => Boolean(code)),
  );
  const first = `${base}-COPY`;
  if (!taken.has(first.toLowerCase())) return first;

  let suffix = 2;
  let candidate = `${base}-COPY-${suffix}`;
  while (taken.has(candidate.toLowerCase())) {
    suffix += 1;
    candidate = `${base}-COPY-${suffix}`;
  }
  return candidate;
};
