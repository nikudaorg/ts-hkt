import { HKT } from '.';

/**
 * An HKT that always returns the same output type.
 */
export interface ConstHKT<TInput, TOutput> extends HKT<TInput, TOutput> {
  output: TOutput;
}
