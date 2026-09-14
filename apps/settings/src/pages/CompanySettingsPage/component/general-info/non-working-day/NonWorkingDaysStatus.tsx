import { Callout } from '@cms/ui';
import type { NonWorkingDaysStatusProps } from '../../../types';
import { describeNonWorkingDateError } from '../../../util';

export const NonWorkingDaysStatus = ({
  queryError,
  saveMessage,
  writeError,
}: NonWorkingDaysStatusProps) => (
  <>
    {saveMessage ? (
      <Callout title="Saved" variant="success">
        {saveMessage}
      </Callout>
    ) : null}
    {writeError ? (
      <Callout title="Could not save" variant="error">
        {describeNonWorkingDateError(writeError)}
      </Callout>
    ) : null}
    {queryError ? (
      <Callout title="Unable to load non-working days" variant="error">
        {describeNonWorkingDateError(queryError)}
      </Callout>
    ) : null}
  </>
);
