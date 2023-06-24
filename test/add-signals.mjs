import { test } from 'uvu'
import * as assert from 'uvu/assert'

import addSignals from '../src/add-signals.mjs'
import { Signal } from '@preact/signals-core'

test('basic signals', () => {
  const obj = {}
  const ret = addSignals(obj, {
    foo: 'bar'
  })

  assert.is(ret, obj)
  assert.instance(obj.$foo, Signal)
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

  assert.instance(obj.$foo, Signal)
  assert.instance(obj.$bar, Signal)
  assert.equal(obj.foo, 17)
  assert.equal(obj.bar, 18)

  assert.throws(() => (obj.bar = 19))
})

test.run()
