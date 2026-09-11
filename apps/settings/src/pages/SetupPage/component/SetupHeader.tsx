import { BodySmall, Heading1, SearchIcon, TextInput } from '@cms/ui';
import type { ChangeEvent } from 'react';

export interface SetupHeaderProps {
  onQueryChange: (value: string) => void;
  query: string;
}

export function SetupHeader({ onQueryChange, query }: SetupHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="pb-3">
        <Heading1>Setup</Heading1>
        <BodySmall color="foreground-subtle">
          Configure your FSM environment
        </BodySmall>
      </div>
      <TextInput
        aria-label="Search settings"
        className="sm:w-[200px]"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onQueryChange(event.target.value)
        }
        placeholder="Search settings"
        startAdornment={<SearchIcon />}
        value={query}
      />
    </div>
  );
}
