import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PRICE_BOOK_LINE_EQUIPMENT,
  PRICE_BOOK_LINE_MATERIAL,
  PRICE_BOOK_LINE_OTHER,
  componentPricesAreDirty,
  createPriceBookMutationOptions,
  emptyPriceBookForm,
  jobTypeListQueryOptions,
  priceBookDetailQueryOptions,
  priceBookFormSchema,
  toPriceBookFormValues,
  toPriceBookWriteDto,
  updatePriceBookMutationOptions,
  type PriceBookForm,
  type PriceBookLineKind,
} from '@cms/settings-data-access';
import { alert, BodySmall, Button, Tabs, TabsList, TabsTrigger } from '@cms/ui';
import {
  PricebookDiscardDialog,
  PricebookEditorHeader,
  PricebookLineItemsPanel,
  PricebookMembershipSection,
  PricebookPricingSection,
  PricebookServiceFields,
} from './component';
import {
  CANCEL_LABEL,
  CREATE_PAGE_TITLE,
  CREATE_SUCCESS_MESSAGE,
  CREATE_SUCCESS_TITLE,
  DETAILS_TAB,
  EDIT_PAGE_TITLE,
  EDITOR_DESCRIPTION,
  EQUIPMENT_TAB,
  LOAD_ERROR_TITLE,
  MATERIAL_TAB,
  OTHER_TAB,
  PRICEBOOK_FORM_ID,
  PRICEBOOK_LIST_PAGE_SIZE,
  SAVE_ERROR_TITLE,
  SAVE_LABEL,
  UPDATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_TITLE,
} from './constant';
import type { PricebookEditorTab, PricebookPageProps } from './types';
import { describePricebookError } from './util';

const EMPTY_FORM = emptyPriceBookForm();

const tabToKind = (tab: PricebookEditorTab): PriceBookLineKind => {
  if (tab === EQUIPMENT_TAB) return PRICE_BOOK_LINE_EQUIPMENT;
  if (tab === OTHER_TAB) return PRICE_BOOK_LINE_OTHER;
  return PRICE_BOOK_LINE_MATERIAL;
};

const isEditorTab = (value: string): value is PricebookEditorTab =>
  value === DETAILS_TAB ||
  value === MATERIAL_TAB ||
  value === EQUIPMENT_TAB ||
  value === OTHER_TAB;

export const PricebookEditorPage = ({ queryClient }: PricebookPageProps) => {
  const { priceBookId: rawId } = useParams();
  const navigate = useNavigate();
  const priceBookId =
    rawId != null && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const isCreate = rawId == null;
  const invalidId = rawId != null && priceBookId == null;
  const [tab, setTab] = useState<PricebookEditorTab>(DETAILS_TAB);
  const [discardOpen, setDiscardOpen] = useState(false);

  const detailQuery = useQuery(
    {
      ...priceBookDetailQueryOptions(priceBookId ?? 0),
      enabled: priceBookId != null,
    },
    queryClient,
  );
  const jobTypesQuery = useQuery(
    jobTypeListQueryOptions({
      page: 1,
      pageSize: PRICEBOOK_LIST_PAGE_SIZE,
    }),
    queryClient,
  );
  const createMutation = useMutation(
    createPriceBookMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updatePriceBookMutationOptions(queryClient),
    queryClient,
  );

  const priceBook = detailQuery.data;
  const formValues = useMemo(
    () => (priceBook ? toPriceBookFormValues(priceBook) : EMPTY_FORM),
    [priceBook],
  );
  const form = useForm<PriceBookForm>({
    mode: 'onBlur',
    resolver: zodResolver(priceBookFormSchema),
    defaultValues: EMPTY_FORM,
    values: formValues,
    resetOptions: { keepDirtyValues: true },
  });
  const isDirty = form.formState.isDirty;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const showForm = isCreate || priceBook != null;

  const handleLeave = () => {
    navigate('..', { relative: 'path' });
  };

  const handleCancel = () => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    handleLeave();
  };

  const handleDiscardOpenChange = (open: boolean) => {
    setDiscardOpen(open);
  };

  const handleDiscardConfirm = () => {
    setDiscardOpen(false);
    handleLeave();
  };

  const handleTabChange = (value: string) => {
    if (isEditorTab(value)) setTab(value);
  };

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describePricebookError(error),
    });
  };

  const handleSubmit = (values: PriceBookForm) => {
    if (isPending) return;
    const body = toPriceBookWriteDto(values, {
      savedBasePrice: priceBook?.basePrice,
      componentPricesDirty: componentPricesAreDirty(form.formState.dirtyFields),
    });
    if (priceBookId != null) {
      updateMutation.mutate(
        { id: priceBookId, body },
        {
          onError: handleWriteError,
          onSuccess: (updated) => {
            form.reset(toPriceBookFormValues(updated));
            alert.success(UPDATE_SUCCESS_TITLE, {
              description: UPDATE_SUCCESS_MESSAGE,
            });
          },
        },
      );
      return;
    }
    createMutation.mutate(body, {
      onError: handleWriteError,
      onSuccess: (created) => {
        alert.success(CREATE_SUCCESS_TITLE, {
          description: CREATE_SUCCESS_MESSAGE,
        });
        navigate(`../${created.id}`, { relative: 'path', replace: true });
      },
    });
  };

  const title = isCreate ? CREATE_PAGE_TITLE : EDIT_PAGE_TITLE;

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="pricebook-editor"
    >
      <PricebookEditorHeader description={EDITOR_DESCRIPTION} title={title} />
      {invalidId ? (
        <BodySmall color="foreground-subtle">{LOAD_ERROR_TITLE}.</BodySmall>
      ) : null}
      {priceBookId != null && detailQuery.isPending ? (
        <BodySmall color="foreground-subtle">Loading service…</BodySmall>
      ) : null}
      {priceBookId != null && detailQuery.isError ? (
        <BodySmall color="foreground-subtle">
          {LOAD_ERROR_TITLE}. {describePricebookError(detailQuery.error)}
        </BodySmall>
      ) : null}
      {showForm ? (
        <>
          <Tabs onValueChange={handleTabChange} value={tab}>
            <TabsList>
              <TabsTrigger size="default" tone="action" value={DETAILS_TAB}>
                Details
              </TabsTrigger>
              <TabsTrigger size="default" tone="action" value={MATERIAL_TAB}>
                Material
              </TabsTrigger>
              <TabsTrigger size="default" tone="action" value={EQUIPMENT_TAB}>
                Equipment
              </TabsTrigger>
              <TabsTrigger size="default" tone="action" value={OTHER_TAB}>
                Other
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="min-h-0 flex-1 overflow-hidden">
            <FormProvider {...form}>
              <form
                className={
                  tab === DETAILS_TAB
                    ? 'flex h-full flex-col gap-4 overflow-y-auto'
                    : 'hidden'
                }
                id={PRICEBOOK_FORM_ID}
                noValidate
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <PricebookServiceFields
                  jobTypes={jobTypesQuery.data?.items ?? []}
                />
                <PricebookPricingSection
                  savedBasePrice={priceBook?.basePrice}
                />
                <PricebookMembershipSection />
              </form>
            </FormProvider>
            {tab === DETAILS_TAB ? null : (
              <PricebookLineItemsPanel
                kind={tabToKind(tab)}
                priceBookId={priceBookId}
                queryClient={queryClient}
              />
            )}
          </div>
          <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border pt-3">
            <Button
              disabled={isPending}
              onClick={handleCancel}
              type="button"
              variant="outline"
            >
              {CANCEL_LABEL}
            </Button>
            <Button form={PRICEBOOK_FORM_ID} loading={isPending} type="submit">
              {SAVE_LABEL}
            </Button>
          </footer>
        </>
      ) : null}
      <PricebookDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </section>
  );
};
