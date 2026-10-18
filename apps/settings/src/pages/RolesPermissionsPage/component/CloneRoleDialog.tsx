import { useEffect, useState } from 'react';
import {
  BodySmall,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextInput,
} from '@cms/ui';
import {
  CLONE_ROLE_NAME_LABEL,
  CLONE_ROLE_SAVE_LABEL,
  CREATE_ROLE_SUBTITLE,
  CREATE_ROLE_TITLE,
  TAB_BACK_OFFICE,
  TAB_MOBILE,
} from '../constant';
import type { CloneRoleDialogProps } from '../types';
import { BackOfficePermissionsTab } from './BackOfficePermissionsTab';
import { MobilePermissionsTab } from './MobilePermissionsTab';

const buildDefaultCloneName = (sourceName: string | null | undefined) => {
  const label = sourceName?.trim() || 'Role';
  return `Copy of ${label}`;
};

export const CloneRoleDialog = ({
  allowedPermissionIds,
  catalog,
  initialPermissionIds,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  sourceRole,
}: CloneRoleDialogProps) => {
  const [name, setName] = useState('');
  const [draftPermissionIds, setDraftPermissionIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [activeTab, setActiveTab] = useState<'back-office' | 'mobile'>(
    'back-office',
  );

  useEffect(() => {
    if (!open) return;
    setName(buildDefaultCloneName(sourceRole.name ?? sourceRole.roleCode));
    setDraftPermissionIds(new Set(initialPermissionIds));
    setActiveTab('back-office');
  }, [initialPermissionIds, open, sourceRole.name, sourceRole.roleCode]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleTogglePermission = (permissionId: number, checked: boolean) => {
    if (checked && !allowedPermissionIds.has(permissionId)) return;
    setDraftPermissionIds((current) => {
      const next = new Set(current);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return next;
    });
  };

  const handleTabChange = (value: string) => {
    if (value === 'back-office' || value === 'mobile') {
      setActiveTab(value);
    }
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const permissionIds = [...draftPermissionIds].filter((id) =>
      allowedPermissionIds.has(id),
    );
    void onSubmit({ name: trimmed, permissionIds });
  };

  const sourceLabel =
    sourceRole.name?.trim() || sourceRole.roleCode?.trim() || 'system role';

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-4 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {CREATE_ROLE_TITLE}
          </DialogTitle>
          <BodySmall color="foreground-subtle">
            {CREATE_ROLE_SUBTITLE} Source: {sourceLabel}.
          </BodySmall>
        </DialogHeader>

        <TextInput
          label={CLONE_ROLE_NAME_LABEL}
          onChange={(event) => setName(event.target.value)}
          value={name}
          variant="soft"
        />

        <Tabs
          className="flex min-h-0 flex-1 flex-col"
          onValueChange={handleTabChange}
          value={activeTab}
        >
          <TabsList bordered>
            <TabsTrigger value="back-office">{TAB_BACK_OFFICE}</TabsTrigger>
            <TabsTrigger value="mobile">{TAB_MOBILE}</TabsTrigger>
          </TabsList>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <TabsContent className="mt-0" value="back-office">
              <BackOfficePermissionsTab
                allowedPermissionIds={allowedPermissionIds}
                canEdit
                catalog={catalog}
                onTogglePermission={handleTogglePermission}
                selectedPermissionIds={draftPermissionIds}
              />
            </TabsContent>
            <TabsContent className="mt-0" value="mobile">
              <MobilePermissionsTab
                allowedPermissionIds={allowedPermissionIds}
                canEdit
                catalog={catalog}
                onTogglePermission={handleTogglePermission}
                selectedPermissionIds={draftPermissionIds}
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
          <Button disabled={isPending} onClick={handleClose} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={!name.trim() || isPending}
            loading={isPending}
            onClick={handleSubmit}
          >
            {CLONE_ROLE_SAVE_LABEL}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
