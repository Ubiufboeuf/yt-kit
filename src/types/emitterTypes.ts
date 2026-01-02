export interface EventMap {
  event: (e: string) => void
}

export type EventName = keyof EventMap
export type EventArgs<T extends EventName> = Parameters<EventMap[T]>
export type EventHandler<T extends EventName> = EventMap[T]
