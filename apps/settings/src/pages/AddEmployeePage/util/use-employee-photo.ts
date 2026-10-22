import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, type QueryClient } from '@tanstack/react-query';
import { patchEmployeeMutationOptions } from '@cms/settings-data-access';
import {
  attachmentDownloadQueryOptions,
  createAttachmentMutationOptions,
} from '@cms/shared-data-access';
import { alert } from '@cms/ui';
import { describeEmployeeError } from '../../EmployeesPage/util';
import { PHOTO_UPLOAD_ERROR_TITLE } from '../constant';

const EMPLOYEE_ENTITY_TYPE = 'Employee';
const PROFILE_PHOTO_CATEGORY = 'profilePhoto';

interface UseEmployeePhotoParams {
  employeeId: number | undefined;
  existingFileId: number | null | undefined;
  queryClient: QueryClient;
}

const toPreviewBlob = (blob: Blob): Blob => {
  if (blob.type.startsWith('image/')) return blob;
  return new Blob([blob], { type: 'image/jpeg' });
};

export const useEmployeePhoto = ({
  employeeId,
  existingFileId,
  queryClient,
}: UseEmployeePhotoParams) => {
  const pendingFileRef = useRef<File | null>(null);
  const localPreviewUrlRef = useRef<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [hasPendingPhoto, setHasPendingPhoto] = useState(false);

  const createAttachmentMutation = useMutation(
    createAttachmentMutationOptions(queryClient),
    queryClient,
  );
  const patchEmployeeMutation = useMutation(
    patchEmployeeMutationOptions(queryClient),
    queryClient,
  );

  const storedFileId = existingFileId ?? null;
  const downloadQuery = useQuery(
    {
      ...attachmentDownloadQueryOptions(
        EMPLOYEE_ENTITY_TYPE,
        storedFileId ?? 0,
      ),
      enabled: storedFileId != null && localPreviewUrl == null,
    },
    queryClient,
  );

  const [remotePreviewUrl, setRemotePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = downloadQuery.data;
    if (!blob) return;
    const url = URL.createObjectURL(toPreviewBlob(blob));
    setRemotePreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [downloadQuery.data]);

  useEffect(
    () => () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    },
    [],
  );

  const replaceLocalPreview = (file: File) => {
    const nextUrl = URL.createObjectURL(file);
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
    }
    localPreviewUrlRef.current = nextUrl;
    setLocalPreviewUrl(nextUrl);
  };

  const uploadProfilePhoto = async (recordId: number, file: File) => {
    const attachment = await createAttachmentMutation.mutateAsync({
      file,
      entityType: EMPLOYEE_ENTITY_TYPE,
      entityId: recordId,
      category: PROFILE_PHOTO_CATEGORY,
    });
    await patchEmployeeMutation.mutateAsync({
      id: recordId,
      body: { profilePhotoFileId: attachment.attachmentId },
    });
    pendingFileRef.current = null;
    setHasPendingPhoto(false);
  };

  const handleFileSelected = async (file: File) => {
    replaceLocalPreview(file);
    if (employeeId == null) {
      pendingFileRef.current = file;
      setHasPendingPhoto(true);
      return;
    }
    try {
      await uploadProfilePhoto(employeeId, file);
    } catch (error) {
      pendingFileRef.current = file;
      setHasPendingPhoto(true);
      alert.error(PHOTO_UPLOAD_ERROR_TITLE, {
        description: describeEmployeeError(error),
      });
    }
  };

  const uploadPendingPhoto = async (recordId: number) => {
    const file = pendingFileRef.current;
    if (!file) return;
    await uploadProfilePhoto(recordId, file);
  };

  return {
    handleFileSelected,
    hasPendingPhoto,
    hasStoredPhoto: storedFileId != null,
    isUploading:
      createAttachmentMutation.isPending || patchEmployeeMutation.isPending,
    previewUrl: localPreviewUrl ?? remotePreviewUrl,
    uploadPendingPhoto,
  };
};
