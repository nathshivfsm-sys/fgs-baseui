import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export type AvatarSize = 'sm' | 'default' | 'lg';

export interface AvatarProps
  extends StringClassName<ComponentProps<typeof AvatarPrimitive.Root>> {
  size?: AvatarSize;
}

/**
 * Avatar surface. `size` is published as `data-size` so nested parts
 * (`AvatarFallback`, `AvatarBadge`) can size themselves from the root.
 */
export function Avatar({ className, size = 'default', ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border data-[size=lg]:size-10 data-[size=sm]:size-6',
        className,
      )}
      data-size={size}
      data-slot="avatar"
      {...props}
    />
  );
}

export type AvatarImageProps = StringClassName<
  ComponentProps<typeof AvatarPrimitive.Image>
>;

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      className={cn(
        'aspect-square size-full rounded-full object-cover',
        className,
      )}
      data-slot="avatar-image"
      {...props}
    />
  );
}

export type AvatarFallbackProps = StringClassName<
  ComponentProps<typeof AvatarPrimitive.Fallback>
>;

/** Rendered while the image is missing or loading; typically initials. */
export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-secondary text-control text-secondary-foreground group-data-[size=sm]/avatar:text-caption',
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

/** Status dot or small icon anchored to the avatar's bottom-right corner. */
export function AvatarBadge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-brand text-brand-foreground ring-2 ring-background',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        className,
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
}

/** Overlaps its avatars; pairs with `AvatarGroupCount` for an overflow indicator. */
export function AvatarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
        className,
      )}
      data-slot="avatar-group"
      {...props}
    />
  );
}

export function AvatarGroupCount({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-control text-secondary-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        className,
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  );
}
