import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import type {
  TechSkillLevelCreateDto,
  TechSkillLevelSummaryDto,
  TechTradeCreateDto,
  TechTradeSummaryDto,
} from '@cms/settings-contract';
import {
  createTechSkillLevelMutationOptions,
  createTechTradeMutationOptions,
  deleteTechSkillLevelMutationOptions,
  deleteTechTradeMutationOptions,
  techSkillLevelLookupQueryOptions,
  techTradeListQueryOptions,
  techTradeLookupQueryOptions,
  updateTechSkillLevelMutationOptions,
  updateTechTradeMutationOptions,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  CatalogNavPanel,
  SkillDeleteDialog,
  SkillFormDialog,
  SkillsTablePanel,
  TradeDeleteDialog,
  TradeFormDialog,
  TradeSkillsHeader,
  TradeTablePanel,
} from './component';
import {
  DELETE_ERROR_TITLE,
  DELETE_SUCCESS_TITLE,
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_TITLE,
  SKILL_CREATED_MESSAGE,
  SKILL_DELETED_MESSAGE,
  SKILL_UPDATED_MESSAGE,
  TRADE_CREATED_MESSAGE,
  TRADE_DELETED_MESSAGE,
  TRADE_UPDATED_MESSAGE,
} from './constant';
import type { TradeCatalog } from './types';
import {
  catalogFromSearch,
  describeSkillError,
  describeTradeError,
} from './util';

export interface TradeSkillsPageProps {
  queryClient: QueryClient;
}

export const TradeSkillsPage = ({ queryClient }: TradeSkillsPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TechTradeSummaryDto | null>(
    null,
  );
  const [deletingTrade, setDeletingTrade] =
    useState<TechTradeSummaryDto | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] =
    useState<TechSkillLevelSummaryDto | null>(null);
  const [deletingSkill, setDeletingSkill] =
    useState<TechSkillLevelSummaryDto | null>(null);

  const activeTradeLookup = useQuery(
    techTradeLookupQueryOptions(true),
    queryClient,
  );
  const allTradeLookup = useQuery(
    techTradeLookupQueryOptions(false),
    queryClient,
  );
  const activeSkillLookup = useQuery(
    techSkillLevelLookupQueryOptions(true),
    queryClient,
  );
  const allSkillLookup = useQuery(
    techSkillLevelLookupQueryOptions(false),
    queryClient,
  );
  const allTradesQuery = useQuery(
    techTradeListQueryOptions({ page: 1, pageSize: 100 }),
    queryClient,
  );
  const createTradeMutation = useMutation(
    createTechTradeMutationOptions(queryClient),
    queryClient,
  );
  const updateTradeMutation = useMutation(
    updateTechTradeMutationOptions(queryClient),
    queryClient,
  );
  const deleteTradeMutation = useMutation(
    deleteTechTradeMutationOptions(queryClient),
    queryClient,
  );
  const createSkillMutation = useMutation(
    createTechSkillLevelMutationOptions(queryClient),
    queryClient,
  );
  const updateSkillMutation = useMutation(
    updateTechSkillLevelMutationOptions(queryClient),
    queryClient,
  );
  const deleteSkillMutation = useMutation(
    deleteTechSkillLevelMutationOptions(queryClient),
    queryClient,
  );

  const activeTradeCount = activeTradeLookup.data?.length ?? 0;
  const inactiveTradeCount = Math.max(
    0,
    (allTradeLookup.data?.length ?? 0) - activeTradeCount,
  );
  const activeSkillCount = activeSkillLookup.data?.length ?? 0;
  const inactiveSkillCount = Math.max(
    0,
    (allSkillLookup.data?.length ?? 0) - activeSkillCount,
  );

  const skillOptions = useMemo(
    () =>
      (activeSkillLookup.data ?? []).map((skill) => ({
        label: skill.name ?? skill.code ?? String(skill.id),
        value: String(skill.id),
      })),
    [activeSkillLookup.data],
  );

  const skillLabelsById = useMemo(
    () =>
      new Map(
        (allSkillLookup.data ?? []).map((skill) => [
          skill.id,
          skill.name ?? skill.code ?? '',
        ]),
      ),
    [allSkillLookup.data],
  );

  const openCreateTrade = () => {
    setEditingTrade(null);
    setTradeDialogOpen(true);
  };

  const openEditTrade = (trade: TechTradeSummaryDto) => {
    setEditingTrade(trade);
    setTradeDialogOpen(true);
  };

  const closeTradeDialog = () => {
    setTradeDialogOpen(false);
  };

  const openCreateSkill = () => {
    setEditingSkill(null);
    setSkillDialogOpen(true);
  };

  const openEditSkill = (skill: TechSkillLevelSummaryDto) => {
    setEditingSkill(skill);
    setSkillDialogOpen(true);
  };

  const closeSkillDialog = () => {
    setSkillDialogOpen(false);
  };

  const handleCatalogChange = (next: TradeCatalog) => {
    setSearchParams(next === 'skills' ? { catalog: 'skills' } : {}, {
      replace: true,
    });
  };

  const handleTradeDialogOpenChange = (open: boolean) => {
    setTradeDialogOpen(open);
    if (!open) setEditingTrade(null);
  };

  const handleSkillDialogOpenChange = (open: boolean) => {
    setSkillDialogOpen(open);
    if (!open) setEditingSkill(null);
  };

  const handleTradeDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingTrade(null);
  };

  const handleSkillDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingSkill(null);
  };

  const handleTradeCreated = () => {
    closeTradeDialog();
    alert.success(SAVE_SUCCESS_TITLE, { description: TRADE_CREATED_MESSAGE });
  };

  const handleTradeUpdated = () => {
    closeTradeDialog();
    alert.success(SAVE_SUCCESS_TITLE, { description: TRADE_UPDATED_MESSAGE });
  };

  const handleTradeDeleted = () => {
    setDeletingTrade(null);
    alert.success(DELETE_SUCCESS_TITLE, { description: TRADE_DELETED_MESSAGE });
  };

  const handleSkillCreated = () => {
    closeSkillDialog();
    alert.success(SAVE_SUCCESS_TITLE, { description: SKILL_CREATED_MESSAGE });
  };

  const handleSkillUpdated = () => {
    closeSkillDialog();
    alert.success(SAVE_SUCCESS_TITLE, { description: SKILL_UPDATED_MESSAGE });
  };

  const handleSkillDeleted = () => {
    setDeletingSkill(null);
    alert.success(DELETE_SUCCESS_TITLE, { description: SKILL_DELETED_MESSAGE });
  };

  const handleTradeWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeTradeError(error),
    });
  };

  const handleTradeDeleteError = (error: unknown) => {
    alert.error(DELETE_ERROR_TITLE, {
      description: describeTradeError(error),
    });
  };

  const handleSkillWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeSkillError(error),
    });
  };

  const handleSkillDeleteError = (error: unknown) => {
    alert.error(DELETE_ERROR_TITLE, {
      description: describeSkillError(error),
    });
  };

  const handleTradeSubmit = (body: TechTradeCreateDto) => {
    if (editingTrade) {
      updateTradeMutation.mutate(
        { id: editingTrade.id, body },
        { onError: handleTradeWriteError, onSuccess: handleTradeUpdated },
      );
      return;
    }
    createTradeMutation.mutate(body, {
      onError: handleTradeWriteError,
      onSuccess: handleTradeCreated,
    });
  };

  const handleSkillSubmit = (body: TechSkillLevelCreateDto) => {
    if (editingSkill) {
      updateSkillMutation.mutate(
        { id: editingSkill.id, body },
        { onError: handleSkillWriteError, onSuccess: handleSkillUpdated },
      );
      return;
    }
    createSkillMutation.mutate(body, {
      onError: handleSkillWriteError,
      onSuccess: handleSkillCreated,
    });
  };

  const handleTradeDeleteConfirm = () => {
    if (!deletingTrade) return;
    deleteTradeMutation.mutate(deletingTrade.id, {
      onError: handleTradeDeleteError,
      onSuccess: handleTradeDeleted,
    });
  };

  const handleSkillDeleteConfirm = () => {
    if (!deletingSkill) return;
    deleteSkillMutation.mutate(deletingSkill.id, {
      onError: handleSkillDeleteError,
      onSuccess: handleSkillDeleted,
    });
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="trade-skills"
    >
      <TradeSkillsHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:flex-row">
        <CatalogNavPanel
          activeSkillCount={
            activeSkillLookup.isSuccess ? activeSkillCount : undefined
          }
          activeTradeCount={
            activeTradeLookup.isSuccess ? activeTradeCount : undefined
          }
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
        />
        {catalog === 'skills' ? (
          <SkillsTablePanel
            activeCount={activeSkillCount}
            inactiveCount={inactiveSkillCount}
            onAdd={openCreateSkill}
            onDelete={setDeletingSkill}
            onEdit={openEditSkill}
            queryClient={queryClient}
            trades={allTradesQuery.data?.items ?? []}
          />
        ) : (
          <TradeTablePanel
            activeCount={activeTradeCount}
            inactiveCount={inactiveTradeCount}
            onAdd={openCreateTrade}
            onDelete={setDeletingTrade}
            onEdit={openEditTrade}
            queryClient={queryClient}
            skillLabelsById={skillLabelsById}
          />
        )}
      </div>

      <TradeFormDialog
        key={
          tradeDialogOpen
            ? `trade-${editingTrade?.id ?? 'new'}`
            : 'trade-closed'
        }
        isPending={
          createTradeMutation.isPending || updateTradeMutation.isPending
        }
        onOpenChange={handleTradeDialogOpenChange}
        onSubmit={handleTradeSubmit}
        open={tradeDialogOpen}
        skillOptions={skillOptions}
        trade={editingTrade}
      />
      <TradeDeleteDialog
        isPending={deleteTradeMutation.isPending}
        onConfirm={handleTradeDeleteConfirm}
        onOpenChange={handleTradeDeleteOpenChange}
        open={deletingTrade != null}
        trade={deletingTrade}
      />
      <SkillFormDialog
        key={
          skillDialogOpen
            ? `skill-${editingSkill?.id ?? 'new'}`
            : 'skill-closed'
        }
        isPending={
          createSkillMutation.isPending || updateSkillMutation.isPending
        }
        onOpenChange={handleSkillDialogOpenChange}
        onSubmit={handleSkillSubmit}
        open={skillDialogOpen}
        skill={editingSkill}
      />
      <SkillDeleteDialog
        isPending={deleteSkillMutation.isPending}
        onConfirm={handleSkillDeleteConfirm}
        onOpenChange={handleSkillDeleteOpenChange}
        open={deletingSkill != null}
        skill={deletingSkill}
      />
    </section>
  );
};
