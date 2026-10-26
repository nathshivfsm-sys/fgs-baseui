import {
  Avatar,
  AvatarFallback,
  cn,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  PaymentTermsIcon,
  PhoneLineIcon,
} from '@cms/ui';
import type { CustomerDetailBasicDetailsCardProps } from '../types';
import { getCustomerInitials } from '../util';

const detailRowClass =
  'flex min-w-0 items-center gap-4 text-control text-[#2e323c]';

export const CustomerDetailBasicDetailsCard = ({
  className,
  customer,
  loading = false,
  paymentTermLabel,
}: CustomerDetailBasicDetailsCardProps) => {
  const contactName = customer?.primaryContactName?.trim() || '—';
  const address =
    customer?.formattedAddress?.trim() ||
    [customer?.addressLine1, customer?.city, customer?.state, customer?.country]
      .filter(Boolean)
      .join(', ') ||
    '—';
  const phone = customer?.primaryContactPhone?.trim() || '—';
  const email = customer?.primaryContactEmail?.trim() || '—';
  const website = customer?.website?.trim();
  const contactInitials = getCustomerInitials(customer?.primaryContactName);

  return (
    <section
      className={cn(
        'flex h-full min-h-48 w-full min-w-0 flex-col overflow-hidden',
        'rounded-[10px] border border-[#f7f7f7] bg-surface px-5 py-3',
        'shadow-[4px_4px_64px_16px_rgba(0,0,0,0.02)]',
        className,
      )}
    >
      <h2 className="text-base font-semibold leading-tight text-heading">
        Basic details
      </h2>
      {loading ? (
        <div className="mt-3 flex flex-col gap-3">
          <span className="h-4 w-40 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
          <span className="h-4 w-full animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
          <span className="h-4 w-3/4 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
        </div>
      ) : (
        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
          <div className={detailRowClass}>
            <Avatar className="size-[1.5625rem] after:hidden" size="sm">
              <AvatarFallback className="bg-secondary text-caption font-semibold text-foreground-subtle">
                {contactInitials}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 font-medium">{contactName}</span>
          </div>
          <div className={detailRowClass}>
            <MapPinIcon
              aria-hidden
              className="size-5 shrink-0 text-foreground-subtle"
            />
            <span className="min-w-0">{address}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-2.5 sm:gap-y-3">
            <div className={detailRowClass}>
              <PhoneLineIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              <span className="min-w-0">{phone}</span>
            </div>
            <div className={detailRowClass}>
              <MailIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              <span className="min-w-0 lowercase text-[#2e323c]">{email}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-2.5 sm:gap-y-3">
            <div className={detailRowClass}>
              <LinkIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              {website ? (
                <a
                  className="min-w-0 truncate lowercase text-[#1f54c8] hover:underline"
                  href={
                    website.startsWith('http') ? website : `https://${website}`
                  }
                  rel="noreferrer"
                  target="_blank"
                >
                  {website}
                </a>
              ) : (
                <span className="text-foreground-subtle">—</span>
              )}
            </div>
            <div className={detailRowClass}>
              <PaymentTermsIcon
                aria-hidden
                className="size-5 shrink-0 text-foreground-subtle"
              />
              <span className="min-w-0 text-[#48505e]">
                {paymentTermLabel ?? '—'}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
