import { Link } from 'react-router-dom';
import {
  BodySmall,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cms/ui';
import {
  SETUP_BILLING_LABEL,
  SETUP_BILLING_TAB,
  SETUP_PATH,
  SETUP_TAB_STATE_KEY,
  SettingsPageTitle,
} from '../../../shared';
import { PAGE_TITLE } from '../constant';
import type { PricebookEditorHeaderProps } from '../types';

const CRUMB_LINK_CLASS =
  'rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30';

export const PricebookEditorHeader = ({
  description,
  title,
}: PricebookEditorHeaderProps) => (
  <header className="border-b border-border pb-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link className={CRUMB_LINK_CLASS} to={SETUP_PATH}>
            Setup
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link
            className={CRUMB_LINK_CLASS}
            state={{ [SETUP_TAB_STATE_KEY]: SETUP_BILLING_TAB }}
            to={SETUP_PATH}
          >
            {SETUP_BILLING_LABEL}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link className={CRUMB_LINK_CLASS} relative="path" to="..">
            {PAGE_TITLE}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <SettingsPageTitle to=".." urlRelative>
      {title}
    </SettingsPageTitle>
    <BodySmall color="foreground-subtle">{description}</BodySmall>
  </header>
);
