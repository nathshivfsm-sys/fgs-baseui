export {
  tagCollectionEndpoint,
  tagDetailEndpoint,
  tagListEndpoint,
  tagLookupEndpoint,
} from './tag.endpoints';
export { tagKeys } from './tag.keys';
export {
  createTag,
  createTagMutationOptions,
  patchTag,
  patchTagMutationOptions,
  updateTag,
  updateTagMutationOptions,
} from './tag.mutations';
export {
  loadTag,
  loadTagLookup,
  loadTags,
  tagDetailQueryOptions,
  tagListQueryOptions,
  tagLookupQueryOptions,
} from './tag.queries';
export {
  tagCreateDtoSchema,
  tagDetailDtoSchema,
  tagDetailResponseSchema,
  tagListResponseSchema,
  tagLookupDtoSchema,
  tagLookupResponseSchema,
  tagPatchDtoSchema,
  tagSummaryDtoSchema,
  tagUpdateDtoSchema,
  type TagCreateDto,
  type TagDetailDto,
  type TagListParams,
  type TagLookupDto,
  type TagPatchDto,
  type TagSummaryDto,
  type TagUpdateDto,
} from '@cms/shared-contract';
