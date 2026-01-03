/* eslint-disable @typescript-eslint/no-explicit-any */

/* Se supone que con el TypeScript actual
no hay manera de hacer los tipos lo más específicos para los eventos
(al menos no sin empeorar varias cosas que no salen a cuenta),
así que una buena solución actual es esto */

type EventMap = object
type Handler = (arg: unknown) => void

export class Emitter<EventList extends EventMap> {
  private events = new Map<keyof EventList, Set<Handler>>()

  emit<Event extends keyof EventList> (event: Event, eventArg: EventList[Event]) {
    const handlers = this.events.get(event)
    if (!handlers) return

    for (const handler of [...handlers]) {
      handler(eventArg)
    }
  }

  on<Event extends keyof EventList> (event: Event, handler: (event: EventList[Event]) => void) {
    let handlers = this.events.get(event)

    if (!handlers) {
      handlers = new Set()
      this.events.set(event, handlers)
    }

    handlers.add(handler as Handler)
  }

  once<Event extends keyof EventList> (event: Event, handler: (event: EventList[Event]) => void) {
    const wrapper = (params: any) => {
      this.off(event, wrapper)
      handler(params)
    }

    this.on(event, wrapper)
  }

  off<Event extends keyof EventList> (event: Event, handler: (event: EventList[Event]) => void) {
    let handlers = this.events.get(event)
    
    if (!handlers) {
      handlers = new Set<Handler>()
      this.events.set(event, handlers)
    }

    handlers.delete(handler as Handler)
  }

  clear<Event extends keyof EventList> (event: Event) {
    this.events.delete(event)
  }

  resetEmitter () {
    this.events = new Map()
  }
}
