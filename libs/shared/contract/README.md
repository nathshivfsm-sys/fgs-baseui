# `@cms/shared-contract`

Wire request/response DTOs for platform services used by more than one remote
(File Service attachments today). UI, MSW, and `@cms/shared-data-access` import
from here — do not duplicate these types in a remote contract or in mocks.
