import { describe, expect, it } from 'bun:test'
import { Emitter } from '../src/events/Emitter'
import type { AppEvents, EmitterArgs } from '../src/types/emitterTypes'
import { beforeEach } from 'node:test'

describe('Events (Emitter)', () => {
  const testParam = 'Ŧ€$ŧ'
  const cb = (param: EmitterArgs<'test-event'>) => paramFromEvent = param

  let emitter = new Emitter<AppEvents>()
  let paramFromEvent = ''

  beforeEach(() => {
    paramFromEvent = ''
    emitter = new Emitter<AppEvents>()
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
    emitter.on('test-event', cb)
    emitter.emit('test-event', testParam)
    expect(paramFromEvent).toBe(testParam)
  })
  
  it('funcionamiento de once()', () => {
    emitter.once('test-event', cb)
    emitter.emit('test-event', testParam)
    expect(paramFromEvent).toBe(testParam)

    paramFromEvent = ''
    emitter.emit('test-event', testParam)
    expect(paramFromEvent).toBeFalsy()
  })
  
  it('funcionamiento de off()', () => {
    emitter.on('test-event', cb)
    emitter.off('test-event', cb)
    emitter.emit('test-event', testParam)
    expect(paramFromEvent).toBeFalsy()
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
})
