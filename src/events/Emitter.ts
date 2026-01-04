/* eslint-disable @typescript-eslint/no-explicit-any */

/* Se supone que con el TypeScript actual
no hay manera de hacer los tipos lo más específicos para los eventos
(al menos no sin empeorar varias cosas que no salen a cuenta),
así que una buena solución actual es esto */

type EventMap = object
type Listener = (arg: unknown) => void

export class Emitter<EventList extends EventMap> {
  #events = new Map<keyof EventList, Set<Listener>>()

  emit<Event extends keyof EventList> (event: Event, eventArg: EventList[Event]) {
    const listeners = this.#events.get(event)
    if (!listeners) return

    for (const listener of [...listeners]) {
      listener(eventArg)
    }
  }

  on<Event extends keyof EventList> (event: Event, listener: (event: EventList[Event]) => void) {
    let listeners = this.#events.get(event)

    if (!listeners) {
      listeners = new Set()
      this.#events.set(event, listeners)
    }

    listeners.add(listener as Listener)
  }

  once<Event extends keyof EventList> (event: Event, listener: (event: EventList[Event]) => void) {
    const wrapper = (params: any) => {
      this.off(event, wrapper)
      listener(params)
    }

    this.on(event, wrapper)
  }

  off<Event extends keyof EventList> (event: Event, listener: (event: EventList[Event]) => void) {
    let listeners = this.#events.get(event)
    
    if (!listeners) {
      listeners = new Set<Listener>()
      this.#events.set(event, listeners)
    }

    listeners.delete(listener as Listener)
  }

  clear<Event extends keyof EventList> (event: Event) {
    this.#events.delete(event)
  }

  resetEmitter () {
    this.#events = new Map()
  }
}
