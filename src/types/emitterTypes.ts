export type TestEvent = string
export type Event = string

export interface Events {
  'test-event': TestEvent
  event: Event
}

export type EventName = keyof Events
export type EventArgs<T extends EventName> = Events[T]
export type EventHandler<T extends EventName> = (event: EventArgs<T>) => void
