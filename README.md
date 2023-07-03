# signal-extra

Add-ons for the `@preact/signals-core` reactive library

Each is available as a separate default export, or a named export from the root.

## addSignals
```
import addSignals from '@ludlovian/signal-extra/add-signals'

addSignals(obj, {
  var1: value1,
  var2: value2,
  var3: () => fn(obj.var1, obj.var2)
})
```

Adds signals to a target object with sugary getter/setters.

For each key/value pair in the supplied definitions, we create a `signal`
initialised to the given value, and add a getter/setter pair on the target
object at the key name.

The underlying signal is also available on the target with the name prefixed
with `$`, although it is rarely needed.

If the initial value is a function, then a `computed` is created instead, and
only a getter is available.

This allows you to access signals & computeds as if they were regular properties
of the target, avoiding all the `x.value` noise.

## until
```
import until from '@ludlovian/signal-extra/until'

await until(fn, timeout)
```

An async function that awaits until the given reactive function is truthy.
It resolves to `true`.

If the timeout is given, then it will resolve `false` if it timed out before
the given function turned truthy.

It uses `effect`, so the reactive function has to depend on `signal`s or `computed`s!

## subscribe
```
import subscribe from '@ludlovian/signal-extra/subscribe'

const unsub = subscribe(getState, callback, opts)
```

Subscribes to a state, as created by the `getState` function, and calls the
given `callback` with the state as it changes.

It returns an unsubscribe function.

It uses `effect`, so the getState function has to depend on `signal`s or `computed`s!

### options

- diff - _(default: true)_ When set, then the callback will only receive incremental diffs
- debounce - If given (in ms), then a waiting debouncer will be used
- bouncer - If a Bouncer instance is supplied, it will be used for the throttling or debouncing

You can also pass any `diff-object` options here, if diffing
