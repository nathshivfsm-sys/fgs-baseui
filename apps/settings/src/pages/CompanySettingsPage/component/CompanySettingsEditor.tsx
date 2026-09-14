import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  patchCompanyMutationOptions,
  companyDetailQueryOptions,
} from '@cms/settings-data-access';
import { Callout } from '@cms/ui';
import type { CompanySettingsEditorProps } from '../types';
import { describeCompanyError } from '../util';
import { CompanySettingsForm } from './CompanySettingsForm';
import { GeneralInfoSkeleton } from './general-info';

const SETUP_PATH = '..';

export const CompanySettingsEditor = ({
  companyId,
  queryClient,
}: CompanySettingsEditorProps) => {
  const navigate = useNavigate();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const query = useQuery(companyDetailQueryOptions(companyId), queryClient);
  const mutation = useMutation(
    patchCompanyMutationOptions(companyId, queryClient),
    queryClient,
  );

  useEffect(() => {
    if (mutation.isSuccess || mutation.isError) {
      feedbackRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [mutation.isError, mutation.isSuccess, mutation.submittedAt]);

  const handleCancel = () => {
    navigate(SETUP_PATH);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
      <div className="scroll-mt-4 empty:hidden" ref={feedbackRef}>
        {mutation.isSuccess ? (
          <Callout title="Saved" variant="success">
            Company details updated
          </Callout>
        ) : null}
        {mutation.isError ? (
          <Callout title="Could not save" variant="error">
            {describeCompanyError(mutation.error)}
          </Callout>
        ) : null}
      </div>

      {query.isPending ? (
        <GeneralInfoSkeleton />
      ) : query.isError ? (
        <Callout title="Unable to load company details" variant="error">
          {describeCompanyError(query.error)}
        </Callout>
      ) : (
        <CompanySettingsForm
          isPending={mutation.isPending}
          onCancel={handleCancel}
          onSubmit={mutation.mutate}
          profile={query.data}
          queryClient={queryClient}
        />
      )}
    </div>
  );
};
