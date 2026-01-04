/* eslint-disable @typescript-eslint/no-explicit-any */

type EventMap = object
type Listener = (arg: unknown) => void
type DefaultEventList = Record<string | number | symbol, any>

/**
 * Sistema de eventos (Pub/Sub) reutilizable, ligero y fuertemente tipado.
 * @template EventList Define la estructura de los eventos y los datos que transportan.
 * @example
 * interface MyEvents {
 *   ready: null
 *   data: { id: number, name: string }
 * }
 * const emitter = new Emitter<MyEvents>()
 * 
 * let isReady = false
 * emitter.on('ready', () => isReady = true)
 * emitter.emit('ready', null)
 * 
 * console.log(isReady) // true
 */
export class Emitter<EventList extends EventMap = DefaultEventList> {
  /** Mapa de eventos y sus respectivos listeners */
  #events = new Map<keyof EventList, Set<Listener>>()

  /**
   * Emite un evento, ejecutando todos los listeners asociados.
   * @param event - Nombre del evento.
   * @param eventArg - Datos asociados al evento (opcional).
   */
  emit<Event extends keyof EventList> (event: Event, eventArg?: EventList[Event]) {
    const listeners = this.#events.get(event)
    if (!listeners) return

    // Se crea una copia para evitar problemas si un listener se desvincula durante el bucle
    for (const listener of [...listeners]) {
      listener(eventArg)
    }
  }

  /**
   * Suscribe una función a un evento específico.
   * @param event - Nombre del evento.
   * @param listener - Callback que se ejecutará cuando el evento sea emitido.
   */
  on<Event extends keyof EventList> (event: Event, listener: (event: EventList[Event]) => void) {
    let listeners = this.#events.get(event)

    if (!listeners) {
      listeners = new Set()
      this.#events.set(event, listeners)
    }

    listeners.add(listener as Listener)
  }

  /**
   * Suscribe una función que se ejecutará solo una vez.
   * Al dispararse, el listener se elimina automáticamente.
   * 
   * @param event - Nombre del evento.
   * @param listener - Callback de un solo uso.
   */
  once<Event extends keyof EventList> (event: Event, listener: (event: EventList[Event]) => void) {
    const wrapper = (params: any) => {
      this.off(event, wrapper)
      listener(params)
    }

    // Guarda la referencia original para poder removerlo usando .off()
    wrapper.listener = listener

    this.on(event, wrapper)
  }

  /**
   * Elimina un listener de un evento específico.
   * @param event - Nombre del evento.
   * @param listener - Referencia de la función a eliminar.
   */
  off<Event extends keyof EventList> (event: Event, listener: (event: EventList[Event]) => void) {
    const listeners = this.#events.get(event)
    
    if (!listeners) return

    const deleted = listeners.delete(listener as Listener)

    if (!deleted) {
      // Intenta eliminar wrappers creados por .once()
      for (const l of listeners) {
        if ((l as any).listener !== listener) continue
        
        listeners.delete(l)
      }
    }

    // Limpieza de memoria: si no hay más suscriptores, se elimina la clave del mapa
    if (listeners.size === 0) {
      this.#events.delete(event)
    }
  }

  /**
   * Devuelve el número de suscriptores activos para un evento.
   * @param event - Nombre del evento.
   */
  listenerCount<Event extends keyof EventList> (event: Event) {
    const listeners = this.#events.get(event)
    return listeners?.size ?? 0
  }

  /**
   * Elimina todos los suscriptores de un evento específico.
   * @param event - Nombre del evento a limpiar.
   */
  clear<Event extends keyof EventList> (event: Event) {
    this.#events.delete(event)
  }

  /**
   * Reinicia el Emitter, eliminando todos los eventos y suscriptores.
   */
  resetEmitter () {
    this.#events = new Map()
  }
}
