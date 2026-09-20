import type {
  TechTradeCreateDto,
  TechTradeSummaryDto,
} from '@cms/settings-contract';
import type { SelectOption } from '@cms/ui';

export interface TradeFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: TechTradeCreateDto) => void;
  open: boolean;
  skillOptions: readonly SelectOption[];
  trade: TechTradeSummaryDto | null;
}

export interface TradeDeleteDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  trade: TechTradeSummaryDto | null;
}
