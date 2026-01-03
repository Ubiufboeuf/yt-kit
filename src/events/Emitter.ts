/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EventHandler, EventName, EventArgs } from '../types/emitterTypes'

export class Emitter {
  private events = new Map<EventName, Set<(...args: any[]) => void>>()

  emit<T extends EventName> (event: T, eventArg: EventArgs<T>) {
    const handlers = this.events.get(event)
    if (!handlers) return

    for (const handler of [...handlers]) {
      handler(eventArg)
    }
  }

  on<T extends EventName> (event: T, handler: EventHandler<T>) {
    if (!handler) {
      throw new Error('Falta especificar un manejador para el evento')
    }

    let handlers = this.events.get(event)

    if (!handlers) handlers = new Set<(...args: any[]) => void>()
    if (handlers.has(handler)) return

    handlers.add(handler)

    this.events.set(event, handlers)
  }

  once<T extends EventName> (event: T, handler: EventHandler<T>) {
    if (!handler) {
      throw new Error('Falta especificar un manejador para el evento')
    }

    const wrapper = (params: any) => {
      this.off(event, wrapper)
      handler(params)
    }

    this.on(event, wrapper)
  }

  off<T extends EventName> (event: T, handler: EventHandler<T>) {
    if (!handler) {
      throw new Error('Falta especificar el manejador para desvincular del evento')
    }

    let handlers = this.events.get(event)
    
    if (!handlers) handlers = new Set<(...args: any[]) => void>()
    if (!handlers.has(handler)) return

    handlers.delete(handler)

    this.events.set(event, handlers)
  }
}
