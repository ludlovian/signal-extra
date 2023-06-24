import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { signal } from '@preact/signals-core'
import sleep from 'pixutil/sleep'
import isResolved from 'pixutil/is-resolved'

import until from '../src/until.mjs'

test('basic wait', async () => {
  const $s = signal(1)
  const test = () => $s.value === 2
  const p = until(test)

  assert.instance(p, Promise)
  assert.is(await isResolved(p), false)

  $s.value = 2
  assert.is(await isResolved(p), true)
  assert.is(await p, true)
})

test('already true', async () => {
  const $s = signal(1)
  const test = () => $s.value === 1
  const p = until(test)

  assert.instance(p, Promise)
  assert.is(await isResolved(p), true)
  assert.is(await p, true)
})

test('timeout', async () => {
  const $s = signal(1)
  const test = () => $s.value === 2
  const p = until(test, 100)

  assert.instance(p, Promise)
  assert.is(await isResolved(p), false)

  await sleep(150)
  assert.is(await isResolved(p), true)
  assert.is(await p, false)
})

test.run()
