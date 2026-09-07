/**
 * SPIKE ONLY — deliberately not exported from the @cms/ui barrel.
 *
 * Purpose: decide whether FullCalendar Premium `resourceTimeline` v7 can carry
 * the Dispatch Board. It exercises the five things that decide that:
 *   1. technicians as rows on a horizontal hour axis
 *   2. drag between rows            -> reassign
 *   3. drag along the axis          -> reschedule
 *   4. resize an event              -> change duration
 *   5. drag in from an outside list -> assign
 * plus a synchronous pre-drop veto (trade matching) and fully custom
 * event / row-header rendering.
 *
 * Every gesture is written to a visible log so the emitted intent can be read
 * off the screen instead of inferred.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'temporal-polyfill/global';
import FullCalendar from '@fullcalendar/react';
import themePlugin from '@fullcalendar/react/themes/monarch';
import interactionPlugin, { Draggable } from '@fullcalendar/react/interaction';
import resourceTimelinePlugin from '@fullcalendar/react-scheduler/resource-timeline';
import type { ResourceCellInfo } from '@fullcalendar/react-scheduler';
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/monarch/theme.css';
import '@fullcalendar/react/themes/monarch/palettes/blue.css';
import './dispatch-board-spike.css';
import {
  SPIKE_BASE_DATE,
  SPIKE_TECHNICIANS,
  SPIKE_WORK_ORDERS,
} from './dispatch-board-spike.fixtures';
import type {
  SpikeGestureKind,
  SpikeGestureLogEntry,
  SpikeTechnician,
  SpikeWorkOrder,
} from './dispatch-board-spike.types';

/** Evaluation key published by FullCalendar for non-commercial trial use. */
const EVALUATION_LICENSE_KEY = 'CC-Attribution-NonCommercial-NoDerivatives';

export interface DispatchBoardSpikeProps {
  readonly technicians?: readonly SpikeTechnician[];
  readonly workOrders?: readonly SpikeWorkOrder[];
  readonly initialDate?: string;
  /** Blocks a drop when the work-order trade is not the technician's trade. */
  readonly enforceTradeMatch?: boolean;
  readonly heightPx?: number;
}

const timeLabel = (iso: string | null): string =>
  iso === null
    ? ''
    : new Date(iso).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });

const durationLabel = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder}m`;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
};

export function DispatchBoardSpike({
  technicians = SPIKE_TECHNICIANS,
  workOrders = SPIKE_WORK_ORDERS,
  initialDate = SPIKE_BASE_DATE,
  enforceTradeMatch = true,
  heightPx = 520,
}: DispatchBoardSpikeProps) {
  const [orders, setOrders] = useState<readonly SpikeWorkOrder[]>(workOrders);
  const [log, setLog] = useState<readonly SpikeGestureLogEntry[]>([]);
  const queueRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef(0);

  // Draggable is constructed once but its eventData must read live state.
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  const techById = useMemo(
    () => new Map(technicians.map((t) => [t.id, t])),
    [technicians],
  );

  const record = useCallback(
    (
      kind: SpikeGestureKind,
      workOrderId: string,
      detail: string,
      rejected?: string,
    ) => {
      seqRef.current += 1;
      const entry: SpikeGestureLogEntry = {
        seq: seqRef.current,
        kind,
        workOrderId,
        detail,
        ...(rejected === undefined ? {} : { rejected }),
      };
      setLog((prev) => [entry, ...prev].slice(0, 12));
    },
    [],
  );

  const queue = useMemo(
    () => orders.filter((o) => o.technicianId === null),
    [orders],
  );

  const resources = useMemo(
    () =>
      technicians.map((t) => ({
        id: t.id,
        title: t.name,
        extendedProps: { technician: t },
      })),
    [technicians],
  );

  const events = useMemo(
    () =>
      orders
        .filter((o) => o.technicianId !== null && o.start !== null)
        .map((o) => ({
          id: o.id,
          resourceId: o.technicianId as string,
          title: o.title,
          start: o.start as string,
          end: o.end as string,
          extendedProps: { order: o },
        })),
    [orders],
  );

  // ---- external drag source: the unassigned queue -------------------------
  useEffect(() => {
    const container = queueRef.current;
    if (container === null) return undefined;

    const draggable = new Draggable(container, {
      itemSelector: '[data-spike-wo]',
      eventData: (el: HTMLElement) => {
        const id = el.getAttribute('data-spike-wo') ?? '';
        const order = ordersRef.current.find((o) => o.id === id);
        return {
          id,
          title: order?.title ?? id,
          duration: { minutes: order?.estimatedMinutes ?? 60 },
          extendedProps: { workOrderId: id },
        };
      },
    });

    return () => draggable.destroy();
  }, []);

  // ---- synchronous pre-drop veto (the R8.1 mechanism) --------------------
  const eventAllow = useCallback(
    (span: { resource?: { id: string } }, movingEvent: unknown): boolean => {
      if (!enforceTradeMatch) return true;
      const targetTechId = span.resource?.id;
      if (targetTechId === undefined) return true;
      const tech = techById.get(targetTechId);
      if (tech === undefined) return true;

      const moving = movingEvent as { id?: string } | null;
      const id = moving?.id;
      const order =
        id === undefined
          ? undefined
          : ordersRef.current.find((o) => o.id === id);
      if (order === undefined) return true;

      return order.trade === tech.trade;
    },
    [enforceTradeMatch, techById],
  );

  return (
    <div className="spike-board flex flex-col gap-3">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-heading">
            Dispatch Board — FullCalendar v7 resourceTimeline spike
          </h2>
          <p className="text-xs text-muted-foreground">
            {technicians.length} technicians · {events.length} scheduled ·{' '}
            {queue.length} unassigned ·{' '}
            {enforceTradeMatch
              ? 'trade match enforced on drop'
              : 'trade match off'}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Monday {initialDate} · 7 AM – 7 PM · 15-minute snap
        </p>
      </header>

      <div className="spike-board__workspace">
        {/* ---- unassigned queue: drag source ---- */}
        <aside
          ref={queueRef}
          aria-label="Unassigned work orders"
          className="spike-queue"
        >
          <div className="spike-queue__heading">
            <div>
              <h3>Unassigned Work Orders</h3>
              <p>{queue.length} orders waiting for assignment</p>
            </div>
            <button type="button" aria-label="Filter unassigned work orders">
              <span aria-hidden="true">⌄</span>
            </button>
          </div>

          <div className="spike-queue__chips" aria-label="Work order types">
            <span>
              PO Req. <b>4</b>
            </span>
            <span>
              PO Rec. <b>2</b>
            </span>
            <span>
              Lead <b>3</b>
            </span>
          </div>

          <div className="spike-queue__tabs" aria-label="Requested date">
            <span>
              Past <b>2</b>
            </span>
            <span className="is-active">
              Today <b>3</b>
            </span>
            <span>
              Future <b>1</b>
            </span>
          </div>

          <ul className="spike-queue__list">
            {queue.map((o) => (
              <li key={o.id}>
                <article
                  data-spike-wo={o.id}
                  data-priority={o.priority.toLowerCase()}
                  data-trade={o.trade.toLowerCase()}
                  className="spike-queue-card"
                >
                  <div className="spike-queue-card__top">
                    <span
                      className="spike-queue-card__handle"
                      aria-hidden="true"
                    >
                      ⠿
                    </span>
                    <span className="spike-queue-card__id">{o.id}</span>
                    <span className="spike-queue-card__priority">
                      {o.priority}
                    </span>
                  </div>
                  <strong>{o.customer}</strong>
                  <span className="spike-queue-card__detail">{o.street}</span>
                  <span className="spike-queue-card__detail">{o.title}</span>
                  <div className="spike-queue-card__footer">
                    <span>{o.requestedWindow ?? 'Schedule pending'}</span>
                    <span>{durationLabel(o.estimatedMinutes)}</span>
                  </div>
                </article>
              </li>
            ))}
            {queue.length === 0 && (
              <li className="text-xs text-muted-foreground">
                Queue empty — every work order is scheduled.
              </li>
            )}
          </ul>
        </aside>

        {/* ---- the board ---- */}
        <div className="spike-calendar">
          <FullCalendar
            schedulerLicenseKey={EVALUATION_LICENSE_KEY}
            plugins={[themePlugin, resourceTimelinePlugin, interactionPlugin]}
            initialView="resourceTimelineDay"
            initialDate={initialDate}
            headerToolbar={false}
            height={heightPx}
            timeZone="local"
            slotMinTime="07:00:00"
            slotMaxTime="19:00:00"
            slotDuration="00:30:00"
            snapDuration="00:15:00"
            nowIndicator
            editable
            eventStartEditable
            eventDurationEditable
            eventResourceEditable
            droppable
            resources={resources}
            events={events}
            resourceColumnsWidth={190}
            resourceColumns={[
              {
                field: 'title',
                headerContent: 'Technician',
                cellContent: (arg: ResourceCellInfo) => {
                  const t = arg.resource?.extendedProps['technician'] as
                    | SpikeTechnician
                    | undefined;
                  if (t === undefined) return null;
                  const over = t.scheduledHours > t.availableHours;
                  return (
                    <div className="spike-technician" data-tone={t.tone}>
                      <span
                        className="spike-technician__avatar"
                        aria-hidden="true"
                      >
                        {t.initials}
                        <span className="spike-technician__status" />
                      </span>
                      <span className="spike-technician__details">
                        <strong>{t.name}</strong>
                        <span>
                          {t.region} · {t.trade}
                        </span>
                        <span className={over ? 'is-over-capacity' : undefined}>
                          {t.scheduledHours} / {t.availableHours} hrs
                        </span>
                      </span>
                    </div>
                  );
                },
              },
            ]}
            eventClass={(arg: {
              event: { extendedProps: { order?: SpikeWorkOrder } };
            }) => {
              const technicianId = arg.event.extendedProps.order?.technicianId;
              const tone =
                technicianId === null || technicianId === undefined
                  ? 'blue'
                  : (techById.get(technicianId)?.tone ?? 'blue');
              return `spike-event-shell spike-event-shell--${tone}`;
            }}
            eventContent={(arg: {
              event: {
                id: string;
                title: string;
                start: Date | null;
                end: Date | null;
                extendedProps: { order?: SpikeWorkOrder };
              };
            }) => {
              const o = arg.event.extendedProps.order;
              const start = arg.event.start?.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              });
              const end = arg.event.end?.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              });
              const tone =
                o?.technicianId === null || o?.technicianId === undefined
                  ? 'blue'
                  : (techById.get(o.technicianId)?.tone ?? 'blue');
              return (
                <article className="spike-event" data-tone={tone}>
                  <span className="sr-only">
                    {arg.event.id} {o?.title} for {o?.customer} at {o?.street},{' '}
                    {start} to {end}
                  </span>
                  <div className="spike-event__top">
                    <strong>{arg.event.id}</strong>
                    <span>{start}</span>
                  </div>
                  <span className="spike-event__title">{o?.title}</span>
                  <span className="spike-event__customer">{o?.customer}</span>
                  <div className="spike-event__bottom">
                    <span>{o?.street}</span>
                    <span>{end}</span>
                  </div>
                </article>
              );
            }}
            eventAllow={eventAllow}
            eventDrop={(arg: {
              event: { id: string; start: Date | null; end: Date | null };
              oldEvent: { start: Date | null };
              newResource?: { id: string } | null;
              oldResource?: { id: string } | null;
              revert: () => void;
            }) => {
              const id = arg.event.id;
              const toTech = arg.newResource?.id;
              const fromTech = arg.oldResource?.id;
              const nextStart = arg.event.start?.toISOString() ?? null;
              const nextEnd = arg.event.end?.toISOString() ?? null;

              setOrders((prev) =>
                prev.map((o) =>
                  o.id === id
                    ? {
                        ...o,
                        technicianId: toTech ?? o.technicianId,
                        start: nextStart,
                        end: nextEnd,
                      }
                    : o,
                ),
              );

              if (toTech !== undefined && toTech !== fromTech) {
                record(
                  'reassign',
                  id,
                  `${techById.get(fromTech ?? '')?.name ?? fromTech} -> ${
                    techById.get(toTech)?.name ?? toTech
                  } at ${timeLabel(nextStart)}`,
                );
              } else {
                record(
                  'reschedule',
                  id,
                  `moved to ${timeLabel(nextStart)} – ${timeLabel(nextEnd)}`,
                );
              }
            }}
            eventResize={(arg: {
              event: { id: string; start: Date | null; end: Date | null };
            }) => {
              const id = arg.event.id;
              const nextStart = arg.event.start?.toISOString() ?? null;
              const nextEnd = arg.event.end?.toISOString() ?? null;
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === id ? { ...o, start: nextStart, end: nextEnd } : o,
                ),
              );
              const mins =
                nextStart !== null && nextEnd !== null
                  ? (new Date(nextEnd).getTime() -
                      new Date(nextStart).getTime()) /
                    60000
                  : 0;
              record(
                'resize',
                id,
                `duration now ${mins} min (${timeLabel(nextStart)} – ${timeLabel(nextEnd)})`,
              );
            }}
            eventReceive={(arg: {
              event: {
                id: string;
                start: Date | null;
                end: Date | null;
                extendedProps: { workOrderId?: string };
              };
              resource?: { id: string } | null;
              revert: () => void;
            }) => {
              const id = arg.event.extendedProps.workOrderId ?? arg.event.id;
              const techId = arg.resource?.id ?? null;
              const nextStart = arg.event.start?.toISOString() ?? null;
              const nextEnd = arg.event.end?.toISOString() ?? null;

              // React state is the single source of truth, so drop
              // FullCalendar's own copy and re-render from `events`.
              arg.revert();

              setOrders((prev) =>
                prev.map((o) =>
                  o.id === id
                    ? {
                        ...o,
                        technicianId: techId,
                        start: nextStart,
                        end: nextEnd,
                      }
                    : o,
                ),
              );
              record(
                'assign',
                id,
                `queue -> ${techById.get(techId ?? '')?.name ?? techId} at ${timeLabel(nextStart)}`,
              );
            }}
          />
        </div>
      </div>

      {/* ---- gesture log: makes the emitted intent readable ---- */}
      <section
        aria-label="Gesture log"
        className="rounded-card border border-border bg-card p-2"
      >
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Gesture log (newest first)
        </h3>
        {log.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Drag a card from the queue onto a technician row, drag an event
            between rows, or drag an event edge to resize.
          </p>
        ) : (
          <ol className="flex flex-col gap-0.5 font-mono text-[11px]">
            {log.map((e) => (
              <li key={e.seq} className="flex gap-2">
                <span className="w-6 shrink-0 text-muted-foreground">
                  {e.seq}
                </span>
                <span className="w-20 shrink-0 font-semibold text-link">
                  {e.kind}
                </span>
                <span className="w-24 shrink-0 text-foreground">
                  {e.workOrderId}
                </span>
                <span className="text-muted-foreground">{e.detail}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
