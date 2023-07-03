import { effect } from '@preact/signals-core'
import diffObject from '@ludlovian/diff-object'
import clone from 'pixutil/clone'
import Bouncer from 'bouncer'

export default function subscribe (getCurrent, callback, opts = {}) {
  const { diff = true, ...diffOpts } = opts
  const bouncer =
    opts.bouncer ??
    (opts.debounce ? new Bouncer({ after: opts.debounce }) : null)
  if (bouncer) bouncer.fn = send
  const fn = bouncer ? bouncer.fire : send
  let prev = {}
  const dispose = effect(() => fn(getCurrent()))

  return stop

  function send () {
    let data = getCurrent()
    if (diff) {
      const _data = data
      data = diffObject(prev, _data, diffOpts)
      prev = clone(_data)
      if (!Object.keys(data).length) data = null
    }
    if (data !== null) callback(data)
  }

  function stop () {
    dispose()
    bouncer && bouncer.stop()
  }
}
