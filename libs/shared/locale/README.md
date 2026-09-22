# @cms/shared-locale

Cross-MFE locale preferences (timezone, date format, currency, mobile format) backed by a
single Zustand store. Values are **mutable at runtime** — hydrate from an API response with
`hydrateLocalePreferences` rather than importing fixed constants.

## Usage

```ts
import {
  formatLocaleCurrency,
  formatLocaleDateTime,
  formatLocaleMobile,
  hydrateLocalePreferences,
  localeStore,
  useLocalePreferences,
} from '@cms/shared-locale';

// After GET /company/preferences (example)
hydrateLocalePreferences(apiPayload);

// In React
const preferences = useLocalePreferences();

// Outside React (tables, utils)
formatLocaleDateTime(isoString);
localeStore.getState().setPreferences({ currencyCode: 'CAD' });
```

Module Federation treats this package as a **singleton** so every remote reads the same store.
