import test from 'ava'
import { each } from 'test-each'
import { remove } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'

each(
  [false, true],
  [
    // Main usage
    { target: { one: 1 }, query: 'one', output: {} },
    { target: { one: 1 }, query: 'two', output: { one: 1 } },
    {
      target: { one: 1, two: 2, three: 3 },
      query: 'two three',
      output: { one: 1 },
    },
    { target: { one: { two: 1 } }, query: 'one one.two', output: {} },
    { target: [], query: '.', output: undefined },
    { target: [1], query: [0], output: [] },

    // No changes
    { target: [], query: '0', output: [] },
    { target: [], query: '100', output: [] },
    { target: [undefined], query: '0', output: [undefined] },
    { target: [1], query: '0', output: [] },
    { target: [1, 2], query: '0', output: [undefined, 2] },
    { target: [1, undefined], query: '0', output: [] },
    { target: {}, query: 'one', output: {} },
    { target: { one: undefined }, query: 'one', output: {} },
    { target: { one: 1 }, query: 'one', output: {} },

    // Missing values
    { target: {}, query: '0', output: {} },
    { target: { one: {} }, query: 'one.0', output: { one: {} } },
    { target: [], query: 'two', output: [] },
    { target: { one: [] }, query: 'one.two', output: { one: [] } },

    // `leaves` option
    { target: { one: { two: 1 } }, query: 'one one.two', output: {} },
    {
      target: { one: { two: 1 } },
      query: 'one one.two',
      opts: { leaves: true },
      output: { one: {} },
    },
  ],
  ({ title }, mutate, { target, query, opts, output }) => {
    test(`remove() output | ${title}`, (t) => {
      t.deepEqual(remove(target, query, { mutate, ...opts }), output)

      if (mutate && Array.isArray(target) === Array.isArray(output)) {
        t.deepEqual(target, output)
      }
    })
  },
)

each(
  [
    // `classes` option
    {
      target: getChild(),
      query: '*',
      output: {
        ownEnum: 'ownEnum',
        ownNonEnum: 'ownNonEnum',
        inheritedEnum: 'inheritedEnum',
        inheritedNonEnum: 'inheritedNonEnum',
      },
    },
    {
      target: getChild(),
      query: '*',
      opts: { classes: true, mutate: true },
      output: {
        ownEnum: undefined,
        ownNonEnum: 'ownNonEnum',
        inheritedEnum: 'inheritedEnum',
        inheritedNonEnum: 'inheritedNonEnum',
      },
    },
  ],
  ({ title }, { target, query, opts, output }) => {
    test(`remove() output | ${title}`, (t) => {
      const { ownEnum, ownNonEnum, inheritedEnum, inheritedNonEnum } = remove(
        target,
        query,
        opts,
      )
      t.deepEqual(
        { ownEnum, ownNonEnum, inheritedEnum, inheritedNonEnum },
        output,
      )
    })
  },
)

each(
  [
    { target: {}, query: '.', opts: { classes: true } },
    { target: {}, query: [true] },
  ],
  ({ title }, { target, query, opts }) => {
    test(`remove() validates its input | ${title}`, (t) => {
      t.throws(remove.bind(undefined, target, query, opts))
    })
  },
)
/* eslint-enable max-lines */
