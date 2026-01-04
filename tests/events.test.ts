import { beforeEach, describe, expect, it } from 'bun:test'
import { Emitter } from '../src/events/Emitter'
import type { AppEvents, EmitterArgs } from '../src/types/emitterTypes'

describe('Events (Emitter)', () => {
  const emitter = new Emitter<AppEvents>()

  beforeEach(() => {
    emitter.resetEmitter()
  })
  
  it('funcionamiento de emit() sin eventos', () => {
    expect(() => {
      emitter.emit('test-event', '')
      emitter.emit('event', 0)
    }).not.toThrow()
  })

  it('no debe ejecutar funciones de otros eventos', () => {
    let called = false
    
    emitter.on('test-event', () => called = true)    
    emitter.emit('event', 0)

    expect(called).toBeFalse()
  })
  
  it('funcionamiento de on()', () => {
    let called = 0
    const cb = () => called++

    emitter.on('test-event', cb)
    emitter.emit('test-event', '')
    expect(called).toBe(1)
  })
  
  it('funcionamiento de once()', () => {
    let called = 0
    const cb = () => called++

    emitter.once('test-event', cb)
    emitter.emit('test-event', '')
    expect(called).toBe(1)

    called = 0
    emitter.emit('test-event', '')
    expect(called).toBe(0)
  })

  it('limpiar once() antes de ejecutarse', () => {
    let called = 0
    const cb = () => called++

    emitter.once('test-event', cb)
    emitter.off('test-event', cb)
    
    emitter.emit('test-event', '')

    expect(called).toBe(0)
  })
  
  it('funcionamiento de off()', () => {
    let called = 0
    const cb = () => called++
    
    emitter.on('test-event', cb)
    emitter.off('test-event', cb)
    emitter.emit('test-event', '')
    expect(called).toBe(0)
  })

  it('funcionamiento de clear()', () => {
    let called = 0
    emitter.on('test-event', () => called++)
    emitter.on('test-event', () => called++)
    emitter.on('event', () => called++)

    emitter.clear('test-event')
    
    emitter.emit('test-event', '')
    emitter.emit('event', 0)

    expect(called).toBe(1)
  })

  it('funcionamiento de resetEmitter()', () => {
    let called = 0
    emitter.on('test-event', () => called++)
    emitter.on('test-event', () => called++)
    emitter.on('event', () => called++)
    
    emitter.resetEmitter()
    
    emitter.emit('test-event', '')
    emitter.emit('event', 0)

    expect(called).toBe(0)
  })

  it('mismo listener varias veces sobre sobre un mismo evento', () => {
    let called = 0

    const cb = () => called++

    emitter.on('test-event', cb)
    emitter.on('test-event', cb)

    emitter.emit('test-event', 'a')
    emitter.emit('test-event', 'aa')

    expect(called).toBe(2)
  })

  it('listeners anónimos sobre un mismo evento', () => {
    let called = 0

    emitter.on('test-event', () => called++)
    emitter.on('test-event', () => called++)

    emitter.emit('test-event', 'a')
    emitter.emit('test-event', 'aa')

    expect(called).toBe(4)
  })

  it('anidar on() y once() varias veces', () => {
    let result = ''
    const smallCallback = (param: EmitterArgs<'test-event'>) => result += param
    const midCallback = () => emitter.on('test-event', smallCallback)
    const bigCallback = () => emitter.once('test-event', midCallback)

    /* Anidar on() y once(), sin importar el orden,
    lo único que hace es retrasar (en emits) el último listener.
    Sin una copia del array que desligue la referencia en memoria (como [...listeners]),
    no habría ningún retraso, y habrían más errores */

    emitter.on('test-event', bigCallback)
    emitter.emit('test-event', 'a')
    emitter.emit('test-event', 'b')
    emitter.emit('test-event', 'c')
    emitter.emit('test-event', 'd')
    emitter.emit('test-event', 'e')

    expect(result).toBe('cde')
  })

  it('debe reportar correctamente el conteo de suscriptores', () => {
    const event = 'test-event'
    const cb1 = () => {}
    const cb2 = () => {}

    // 1. Estado inicial (nunca registrado)
    expect(emitter.listenerCount(event)).toBe(0)

    // 2. Al añadir uno
    emitter.on(event, cb1)
    expect(emitter.listenerCount(event)).toBe(1)

    // 3. Al añadir otro (mismo evento)
    emitter.on(event, cb2)
    expect(emitter.listenerCount(event)).toBe(2)

    // 4. Al quitar uno
    emitter.off(event, cb1)
    expect(emitter.listenerCount(event)).toBe(1)

    // 5. Al limpiar el evento
    emitter.clear(event)
    expect(emitter.listenerCount(event)).toBe(0)
  })
})
