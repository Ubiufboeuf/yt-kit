// Genérico
export type EventName<Events> = keyof Events
export type EventArgs<Events, SpecificEvent extends keyof Events> = Events[SpecificEvent]
export type EventHandler<Events, SpecificEvent extends keyof Events> = (event: Events[SpecificEvent]) => void

// Sistema de eventos global
export interface AppEvents {
  'test-event': string
  event: number
}

// Estos quedan por si quien se use la instancia de Emitter
// lo llegase a precisar, pero se pueden crear en el momento
export type EmitterEvent = EventName<AppEvents>
export type EmitterArgs<Event extends EmitterEvent> = AppEvents[Event]
export type EmitterHandler<Event extends EmitterEvent> = (event: EmitterArgs<Event>) => void
