import { HKT, Input } from '.';

/**
 * The identity HKT.
 *
 * Applying `IdHKT<T>` to a narrower input returns that narrower input unchanged.
 */
export interface IdHKT<T = unknown> extends HKT<T> {
  output: Input<this>;
}
