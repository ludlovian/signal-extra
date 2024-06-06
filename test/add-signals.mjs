import { suite, test } from 'node:test'
import assert from 'node:assert/strict'

import addSignals from '../src/add-signals.mjs'
import { Signal } from '@preact/signals-core'

suite('addSignals', () => {
  test('basic signals', () => {
    const obj = {}
    const ret = addSignals(obj, {
      foo: 'bar'
    })

    assert.equal(ret, obj)
    assert.ok(obj.$foo instanceof Signal)
    assert.equal(obj.foo, 'bar')

    obj.foo = 'baz'
    assert.equal(obj.$foo.value, 'baz')
  })

  test('computed', () => {
    const obj = {}
    addSignals(obj, {
      foo: 17,
      bar: () => obj.foo + 1
    })

    assert.ok(obj.$foo instanceof Signal)
    assert.ok(obj.$bar instanceof Signal)
    assert.equal(obj.foo, 17)
    assert.equal(obj.bar, 18)

    assert.throws(() => (obj.bar = 19))
  })
})
