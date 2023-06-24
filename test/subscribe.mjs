import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { signal } from '@preact/signals-core'
import sleep from 'pixutil/sleep'

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
    { debounce: 100 }
  )

  assert.is(calls.length, 0)

  await sleep(110)
  assert.equal(calls, [{ a: 1, b: 2 }])

  s.value = { ...s.value, b: 3 }
  await sleep(50)

  assert.is(calls.length, 1)
  s.value = { ...s.value, b: 4 }

  await sleep(100)
  assert.equal(calls, [{ a: 1, b: 2 }, { b: 4 }])

  unsub()
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
