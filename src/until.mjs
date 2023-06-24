import { effect } from '@preact/signals-core'

// resolves once a reactive function returns truthy
export default function until (fn, timeout) {
  return new Promise(resolve => {
    if (fn()) return resolve(true)
    const tm = timeout ? setTimeout(() => stop(false), timeout) : null
    const dispose = effect(() => fn() && stop(true))
    function stop (result) {
      dispose()
      if (tm) clearTimeout(tm)
      resolve(result)
    }
  })
}
