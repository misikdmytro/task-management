const pick = require('../../../src/utils/pick');

describe('pick', () => {
  const data = [
    {
      name: 'should return an empty object if no keys are provided',
      object: { a: 1, b: 2, c: 3 },
      keys: [],
      expected: {},
    },
    {
      name: 'should return an empty object if object is null',
      object: null,
      keys: ['a', 'b', 'c'],
      expected: {},
    },
    {
      name: 'should return an empty object if object is undefined',
      object: undefined,
      keys: ['a', 'b', 'c'],
      expected: {},
    },
    {
      name: 'should return an empty object if object is empty',
      object: {},
      keys: ['a', 'b', 'c'],
      expected: {},
    },
    {
      name: 'should return an empty object if keys is empty',
      object: { a: 1, b: 2, c: 3 },
      keys: [],
      expected: {},
    },
    {
      name: 'should return an empty object if keys is not an array of strings',
      object: { a: 1, b: 2, c: 3 },
      keys: [1, 2, 3],
      expected: {},
    },
    {
      name: 'should return an empty object if keys is not an array of strings',
      object: { a: 1, b: 2, c: 3 },
      keys: [true, false, true],
      expected: {},
    },
    {
      name: 'should return an empty object if keys is not an array of strings',
      object: { a: 1, b: 2, c: 3 },
      keys: [null, undefined, null],
      expected: {},
    },
    {
      name: 'should return an empty object if keys is not an array of strings',
      object: { a: 1, b: 2, c: 3 },
      keys: [{}, {}, {}],
      expected: {},
    },
    {
      name: 'should return picked object',
      object: { a: 1, b: 2, c: 3 },
      keys: ['a', 'b'],
      expected: { a: 1, b: 2 },
    },
  ];

  data.forEach(({
    name, object, keys, expected,
  }) => {
    it(name, () => {
      const result = pick(object, keys);
      expect(result).toEqual(expected);
    });
  });
});
