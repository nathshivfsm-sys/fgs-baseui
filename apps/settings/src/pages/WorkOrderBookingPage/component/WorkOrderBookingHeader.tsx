import { BodySmall, Button } from '@cms/ui';
import {
  SETUP_OPERATIONS_LABEL,
  SETUP_OPERATIONS_TAB,
  SettingsPageTitle,
  SetupBreadcrumb,
} from '../../../shared';
import { PAGE_DESCRIPTION, PAGE_TITLE, SAVE_CHANGES_LABEL } from '../constant';
import type { WorkOrderBookingHeaderProps } from '../types';
import { formatAuditTimestamp } from '../util';

export const WorkOrderBookingHeader = ({
  auditUpdatedBy,
  auditUpdatedOn,
  canEdit,
  formId,
  isDirty,
  isPending,
}: WorkOrderBookingHeaderProps) => {
  const auditLine =
    auditUpdatedBy && auditUpdatedOn
      ? `Last updated by ${auditUpdatedBy} on ${formatAuditTimestamp(auditUpdatedOn)}`
      : null;

  return (
    <header className="flex items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <SetupBreadcrumb
          moduleKey={SETUP_OPERATIONS_TAB}
          moduleLabel={SETUP_OPERATIONS_LABEL}
          pageLabel={PAGE_TITLE}
        />
        <SettingsPageTitle moduleKey={SETUP_OPERATIONS_TAB}>
          {PAGE_TITLE}
        </SettingsPageTitle>
        <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
        {auditLine ? (
          <BodySmall className="mt-1" color="foreground-subtle">
            {auditLine}
          </BodySmall>
        ) : null}
      </div>
      {canEdit ? (
        <Button
          className="shrink-0"
          disabled={!isDirty || isPending}
          form={formId}
          loading={isPending}
          loadingText="Saving…"
          type="submit"
          variant="action"
        >
          {SAVE_CHANGES_LABEL}
        </Button>
      ) : null}
    </header>
  );
};
