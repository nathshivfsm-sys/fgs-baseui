/**
 * SPIKE ONLY — not part of the @cms/ui public surface.
 *
 * Minimal shapes for evaluating FullCalendar Premium `resourceTimeline` as the
 * Dispatch Board engine. These mirror the real models in the dispatch-board
 * spec closely enough to prove the interactions, and no further.
 */

export interface SpikeTechnician {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly region: string;
  readonly trade: string;
  readonly scheduledHours: number;
  readonly availableHours: number;
}

export type SpikePriority = 'High' | 'Medium' | 'Low';

export interface SpikeWorkOrder {
  readonly id: string;
  readonly title: string;
  readonly customer: string;
  readonly street: string;
  readonly trade: string;
  readonly priority: SpikePriority;
  readonly estimatedMinutes: number;
  /** null means the work order sits in the unassigned queue. */
  readonly technicianId: string | null;
  /** Local ISO datetime, e.g. '2025-05-12T08:00:00'. null while unassigned. */
  readonly start: string | null;
  readonly end: string | null;
}

/** The five gestures the real spec normalises to. The spike proves four of them. */
export type SpikeGestureKind = 'assign' | 'reassign' | 'reschedule' | 'resize';

export interface SpikeGestureLogEntry {
  readonly seq: number;
  readonly kind: SpikeGestureKind;
  readonly workOrderId: string;
  readonly detail: string;
  /** Set when the synchronous pre-drop check rejected the target. */
  readonly rejected?: string;
}
