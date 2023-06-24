import { signal, computed } from '@preact/signals-core'

export default function addSignals (target, signalProps) {
  const defs = {}

  for (const [key, value] of Object.entries(signalProps)) {
    const $key = '$' + key
    const isComputed = typeof value === 'function'
    const $signal = isComputed ? computed(value) : signal(value)
    const get = () => $signal.value
    const set = !isComputed ? x => ($signal.value = x) : undefined
    const configurable = false
    let enumerable = true
    defs[key] = { get, set, enumerable, configurable }
    enumerable = false
    const writable = false
    defs[$key] = { value: $signal, writable, enumerable, configurable }
  }

  return Object.defineProperties(target, defs)
}
