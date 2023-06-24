import { effect } from '@preact/signals-core'
import diffObject from '@ludlovian/diff-object'
import clone from 'pixutil/clone'
import Bouncer from 'bouncer'

export default function subscribe (getCurrent, callback, opts = {}) {
  const { debounce } = opts
  let prev = {}
  const bouncer = debounce ? new Bouncer({ after: debounce, fn: send }) : null
  const fn = bouncer ? bouncer.fire : send
  const dispose = effect(() => fn(getCurrent()))

  return stop

  function send () {
    const latest = getCurrent()
    const diff = diffObject(prev, latest)
    if (Object.keys(diff).length) callback(diff)
    prev = clone(latest)
  }

  function stop () {
    dispose()
    bouncer && bouncer.stop()
  }
}
