import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, type QueryClient } from '@tanstack/react-query';
import {
  attachmentDownloadQueryOptions,
  createAttachmentMutationOptions,
} from '@cms/shared-data-access';
import { alert } from '@cms/ui';
import { describeEmployeeError } from '../../EmployeesPage/util';
import { PHOTO_UPLOAD_ERROR_TITLE } from '../constant';

const EMPLOYEE_ENTITY_TYPE = 'Employee';
const PROFILE_PHOTO_CATEGORY = 'profilePhoto';
/** Create has no employee id yet. The file is linked on save via profilePhotoFileId. */
const UNASSIGNED_ENTITY_ID = 0;

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
  const localPreviewUrlRef = useRef<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);

  const createAttachmentMutation = useMutation(
    createAttachmentMutationOptions(queryClient),
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

  const handleFileSelected = async (file: File) => {
    replaceLocalPreview(file);
    try {
      const attachment = await createAttachmentMutation.mutateAsync({
        file,
        entityType: EMPLOYEE_ENTITY_TYPE,
        entityId: employeeId ?? UNASSIGNED_ENTITY_ID,
        category: PROFILE_PHOTO_CATEGORY,
      });
      setUploadedFileId(attachment.attachmentId);
    } catch (error) {
      alert.error(PHOTO_UPLOAD_ERROR_TITLE, {
        description: describeEmployeeError(error),
      });
    }
  };

  return {
    handleFileSelected,
    hasPendingPhoto: uploadedFileId != null,
    hasStoredPhoto: storedFileId != null,
    isUploading: createAttachmentMutation.isPending,
    previewUrl: localPreviewUrl ?? remotePreviewUrl,
    uploadedFileId,
  };
};
