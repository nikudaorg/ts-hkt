import { Apply, HKT } from '..';

/**
 * Left-folds a tuple using an HKT reducer.
 */
export type Reduce<
  TTAcc,
  TF extends HKT<{ acc: TTAcc; element: TArr[number] }, TTAcc>,
  TInitial extends TTAcc,
  TArr extends Array<unknown>
> = TArr extends [
  infer First extends TArr[number],
  ...infer Rest extends TArr[number][]
]
  ? Reduce<TTAcc, TF, Apply<TF, { acc: TInitial; element: First }>, Rest>
  : TInitial;
