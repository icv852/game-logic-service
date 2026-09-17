export const mapTuple = <T extends readonly unknown[], U>(
  tuple: T,
  fn: (value: T[number], index: number) => U
): { [K in keyof T]: U } => tuple.map(fn) as { [K in keyof T]: U }