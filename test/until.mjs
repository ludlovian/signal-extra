import { suite, test } from 'node:test'
import assert from 'node:assert/strict'

import { signal } from '@preact/signals-core'
import sleep from 'pixutil/sleep'
import isResolved from 'pixutil/is-resolved'

import until from '../src/until.mjs'

suite('until', () => {
  test('basic wait', async () => {
    const $s = signal(1)
    const test = () => $s.value === 2
    const p = until(test)

    assert.ok(p instanceof Promise)
    assert.equal(await isResolved(p), false)

    $s.value = 2
    assert.equal(await isResolved(p), true)
    assert.equal(await p, true)
  })

  test('already true', async () => {
    const $s = signal(1)
    const test = () => $s.value === 1
    const p = until(test)

    assert.ok(p instanceof Promise)
    assert.equal(await isResolved(p), true)
    assert.equal(await p, true)
  })

  test('timeout', async () => {
    const $s = signal(1)
    const test = () => $s.value === 2
    const p = until(test, 50)

    assert.ok(p instanceof Promise)
    assert.equal(await isResolved(p), false)

    await sleep(75)
    assert.equal(await isResolved(p), true)
    assert.equal(await p, false)
  })
})
