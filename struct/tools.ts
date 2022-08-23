export function assertDefined(condition: any): asserts condition {
  if (!condition) {
    throw new Error();
  }
}

export function assertEqual(actual: any, expected: any): asserts actual {
  if (actual !== expected) {
    throw new Error(`'${actual}' !== '${expected}'`);
  }
}
