import { Apply, HKT } from '..';

/**
 * Maps an HKT over a tuple.
 */
export type FMap<
  TF extends HKT<TArr[number]>,
  TArr extends Array<unknown>
> = TArr extends [
  infer First extends TArr[number],
  ...infer Rest extends TArr[number][]
]
  ? [Apply<TF, First>, ...FMap<TF, Rest>]
  : [];
