import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { signal } from '@preact/signals-core'
import sleep from 'pixutil/sleep'
import Bouncer from 'bouncer'

import subscribe from '../src/subscribe.mjs'

test('basic send', () => {
  const s = signal({ a: 1, b: 2 })
  const calls = []

  const unsub = subscribe(
    () => s.value,
    x => calls.push(x)
  )

  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }

  assert.equal(calls, [{ a: 1, b: 2 }, { b: 3 }])

  unsub()
})

test('debounce send', async () => {
  const s = signal({ a: 1, b: 2 })
  const calls = []

  const unsub = subscribe(
    () => s.value,
    x => calls.push(x),
    { debounce: 50 }
  )

  assert.is(calls.length, 0)

  await sleep(70)
  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }
  await sleep(10)

  assert.is(calls.length, 1)
  s.value = { ...s.value, b: 4 }

  await sleep(70)
  assert.equal(calls, [{ a: 1, b: 2 }, { b: 4 }])

  unsub()
})

test('provide bouncer', async () => {
  const s = signal({ a: 1, b: 2 })
  const calls = []
  const bouncer = new Bouncer({ after: 50 })

  const unsub = subscribe(
    () => s.value,
    x => calls.push(x),
    { bouncer }
  )

  assert.is(calls.length, 0)

  await sleep(70)
  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }
  await sleep(10)

  assert.is(calls.length, 1)
  s.value = { ...s.value, b: 4 }

  await sleep(70)
  assert.equal(calls, [{ a: 1, b: 2 }, { b: 4 }])

  unsub()
})

test('no diff', () => {
  const s = signal({ a: 1, b: 2 })
  const calls = []

  subscribe(
    () => s.value,
    x => calls.push(x),
    { diff: false }
  )

  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }

  assert.equal(calls, [
    { a: 1, b: 2 },
    { a: 1, b: 3 }
  ])
})

test('diff with no change', async () => {
  const s = signal({ a: 1, b: 2 })
  const calls = []
  const bouncer = new Bouncer({ every: 50 })

  subscribe(
    () => s.value,
    x => calls.push(x),
    { bouncer }
  )

  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }
  s.value = { ...s.value, b: 2 }

  await sleep(70)

  assert.equal(calls, [{ a: 1, b: 2 }])
  bouncer.stop()
})

test('no send after unsub', () => {
  const s = signal({ a: 1, b: 2 })
  const calls = []

  const unsub = subscribe(
    () => s.value,
    x => calls.push(x)
  )

  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }

  assert.equal(calls, [{ a: 1, b: 2 }, { b: 3 }])

  unsub()

  s.value = { ...s.value, b: 4 }
  assert.equal(calls.length, 2)
})

test.run()
