export function assertDefined(condition: any): asserts condition {
  if (!condition) {
    throw new Error();
  }
}

export function assertEqual<T>(actual: T, expected: T): asserts actual {
  if (actual !== expected) {
    throw new Error(`'${actual}' !== '${expected}'`);
  }
}
