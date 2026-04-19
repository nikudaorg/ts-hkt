import { Apply, HKT, Input, Output } from '.';

/**
 * Composition of two HKTs.
 *
 * `Pipe<F, G>` first applies `G`, then applies `F` to the result.
 */
export interface Pipe<
  F extends HKT,
  G extends HKT<never, Input<F>>
> extends HKT<Input<G>, Output<F>> {
  output: Apply<F, Apply<G, Input<this>>>;
}
