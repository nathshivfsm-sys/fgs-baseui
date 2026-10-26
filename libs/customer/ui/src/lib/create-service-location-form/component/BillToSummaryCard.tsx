import {
  Avatar,
  AvatarFallback,
  BodySmall,
  cn,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  PaymentTermsIcon,
  PhoneLineIcon,
} from '@cms/ui';
import type { BillToSummaryCardProps } from '../types';
import { getBillToInitials } from '../util';

const detailRowClass =
  'flex min-w-0 items-center gap-4 text-control text-[#2e323c]';

export const BillToSummaryCard = ({
  customer,
  errorMessage,
  loading = false,
  paymentTermLabel,
}: BillToSummaryCardProps) => {
  const displayName =
    customer?.displayName?.trim() || customer?.name?.trim() || '—';
  const address =
    customer?.formattedAddress?.trim() ||
    [customer?.addressLine1, customer?.city, customer?.state, customer?.country]
      .filter(Boolean)
      .join(', ') ||
    '—';
  const phone = customer?.primaryContactPhone?.trim() || '—';
  const email = customer?.primaryContactEmail?.trim() || '—';
  const website = customer?.website?.trim();
  const initials = getBillToInitials(customer?.displayName ?? customer?.name);

  return (
    <div
      className={cn(
        'flex min-h-[13.3125rem] flex-col justify-center rounded-[10px] border border-[#f7f7f7] bg-surface px-5 py-3',
        'shadow-[4px_4px_64px_16px_rgba(0,0,0,0.02)]',
      )}
    >
      {loading ? (
        <div className="flex flex-col gap-4">
          <span className="h-4 w-40 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
          <span className="h-4 w-full animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
          <span className="h-4 w-3/4 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
        </div>
      ) : errorMessage ? (
        <BodySmall color="foreground-subtle">{errorMessage}</BodySmall>
      ) : (
        <div className="flex flex-col gap-4">
          <div className={detailRowClass}>
            <Avatar className="size-[1.5625rem] after:hidden" size="sm">
              <AvatarFallback className="bg-secondary text-caption font-semibold text-foreground-subtle">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 capitalize">{displayName}</span>
          </div>
          <div className={detailRowClass}>
            <MapPinIcon
              aria-hidden
              className="size-5 shrink-0 text-foreground-subtle"
            />
            <span className="min-w-0 capitalize">{address}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2.5">
            <div className={detailRowClass}>
              <PhoneLineIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              <span className="min-w-0 capitalize">{phone}</span>
            </div>
            <div className={detailRowClass}>
              <MailIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              <span className="min-w-0 lowercase">{email}</span>
            </div>
          </div>
          {website ? (
            <div className={detailRowClass}>
              <LinkIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              <a
                className="min-w-0 truncate text-action lowercase hover:underline"
                href={
                  website.startsWith('http') ? website : `https://${website}`
                }
                rel="noreferrer"
                target="_blank"
              >
                {website}
              </a>
            </div>
          ) : null}
          <div className={detailRowClass}>
            <PaymentTermsIcon
              aria-hidden
              className="size-5 shrink-0 text-foreground-subtle"
            />
            <span className="min-w-0 text-[#48505e]">
              {paymentTermLabel?.trim() || '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
