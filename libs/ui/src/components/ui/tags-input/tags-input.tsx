import type { KeyboardEvent, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { CloseIcon, PlusIcon } from '../../../icons';
import { cn } from '../../../lib/cn';
import { Badge } from '../badge';
import { Field } from '../field';
import { inputShellVariants } from '../text-input';

export interface TagsInputProps {
  className?: string;
  defaultValue?: readonly string[];
  description?: ReactNode;
  disabled?: boolean;
  /** Keys that commit the pending tag. Defaults to Enter and comma. */
  delimiters?: readonly string[];
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  id?: string;
  label?: ReactNode;
  /** Defaults to `compact` for the `soft` variant, matching the designs. */
  labelSize?: 'default' | 'compact';
  maxTags?: number;
  name?: string;
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  required?: boolean;
  size?: 'sm' | 'default' | 'lg';
  value?: readonly string[];
  variant?: 'default' | 'soft';
}

/**
 * Free-form tag entry: type and press Enter (or comma) to commit, Backspace on
 * an empty input to remove the last tag. Duplicates are ignored.
 */
export function TagsInput({
  className,
  defaultValue,
  delimiters = ['Enter', ','],
  description,
  disabled,
  error,
  helperText,
  id,
  label,
  labelSize,
  maxTags,
  name,
  onValueChange,
  placeholder = 'Select or add tags',
  required,
  size,
  value,
  variant,
}: TagsInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const messageId = `${inputId}-message`;
  const errorMessage = error === true ? undefined : error;
  const inputRef = useRef<HTMLInputElement>(null);

  const [uncontrolled, setUncontrolled] = useState<string[]>(() => [
    ...(defaultValue ?? []),
  ]);
  const [draft, setDraft] = useState('');
  const tags = value !== undefined ? [...value] : uncontrolled;
  const atLimit = maxTags != null && tags.length >= maxTags;

  const commit = (next: string[]) => {
    if (value === undefined) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
  };

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || atLimit || tags.includes(tag)) {
      setDraft('');
      return;
    }
    commit([...tags, tag]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    commit(tags.filter((existing) => existing !== tag));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (delimiters.includes(event.key)) {
      event.preventDefault();
      addTag(draft);
      return;
    }
    if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      event.preventDefault();
      removeTag(tags[tags.length - 1]);
    }
  };

  const describedBy =
    [description && descriptionId, (errorMessage || helperText) && messageId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <Field
      className="w-full"
      description={description}
      descriptionId={descriptionId}
      disabled={disabled}
      error={errorMessage}
      errorId={messageId}
      helperText={helperText}
      htmlFor={inputId}
      label={label}
      required={required}
      size={labelSize ?? (variant === 'soft' ? 'compact' : 'default')}
    >
      {/* Clicking anywhere in the shell should focus the input, matching a
          native field; the inner input remains the real focus target. */}
      <div
        className={cn(
          inputShellVariants({ multiline: true, size, variant }),
          'gap-1.5',
          // Tags are plain text, not disabled form controls, so they are not
          // exempt from contrast requirements. The muted background and
          // non-editable input carry the disabled affordance instead of opacity.
          disabled && 'data-disabled:opacity-100',
          className,
        )}
        data-disabled={disabled || undefined}
        data-invalid={Boolean(error) || undefined}
        data-slot="tags-input"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge
            action={
              disabled ? undefined : (
                <button
                  aria-label={`Remove ${tag}`}
                  className="-mr-0.5 inline-flex shrink-0 items-center rounded-full outline-none hover:text-action-hover focus-visible:ring-[2px] focus-visible:ring-ring/40"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTag(tag);
                  }}
                  type="button"
                >
                  <CloseIcon className="size-3" />
                </button>
              )
            }
            key={tag}
            size="sm"
            tone={disabled ? 'neutral' : 'action'}
          >
            {tag}
          </Badge>
        ))}
        {name != null &&
          tags.map((tag) => (
            <input key={tag} name={name} type="hidden" value={tag} />
          ))}
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error) || undefined}
          className="h-6 min-w-24 flex-1 bg-transparent p-0 text-control leading-5 outline-none placeholder:text-field-foreground disabled:cursor-not-allowed"
          // Stays enabled at the limit so existing tags can still be removed;
          // `addTag` is what enforces `maxTags`.
          disabled={disabled}
          id={inputId}
          onBlur={() => addTag(draft)}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          ref={inputRef}
          value={draft}
        />
        <button
          aria-label="Add tag"
          className="flex shrink-0 items-center rounded-sm text-icon-muted outline-none transition-colors hover:text-action focus-visible:ring-[2px] focus-visible:ring-ring/40 disabled:opacity-50"
          disabled={disabled || atLimit || draft.trim() === ''}
          onClick={(event) => {
            event.stopPropagation();
            addTag(draft);
          }}
          type="button"
        >
          <PlusIcon className="size-3" />
        </button>
      </div>
    </Field>
  );
}
