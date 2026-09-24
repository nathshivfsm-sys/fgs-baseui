/** Resource-specific lines for `describeCatalogError`. Status handling stays shared. */
export interface CatalogErrorCopy {
  conflict: string;
  forbidden: string;
  invalid: string;
  methodNotAllowed?: string;
  notFound: string;
  unreachable: string;
}
