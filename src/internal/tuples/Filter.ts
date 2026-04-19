import { Apply, HKT } from '..';

/**
 * Filters a tuple using an HKT predicate.
 *
 * If the predicate is undecided for an element and returns `boolean`, both
 * branches are preserved in the result type.
 */
export type Filter<
  TF extends HKT<TArr[number], boolean>,
  TArr extends Array<unknown>
> = TArr extends [
  infer First extends TArr[number],
  ...infer Rest extends TArr[number][]
]
  ? boolean extends Apply<TF, First>
    ? [First, ...Filter<TF, Rest>] | Filter<TF, Rest>
    : Apply<TF, First> extends true
      ? [First, ...Filter<TF, Rest>]
      : Filter<TF, Rest>
  : [];
