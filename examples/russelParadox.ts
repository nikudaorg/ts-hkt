import { Apply, HKT, Input } from '../src/';

type ArgBase = HKT<ArgBase, boolean>;

interface RusselHKT extends HKT<ArgBase> {
  output: Apply<Input<this>, Input<this>> extends true ? false : true;
}

// Type instantiation is excessively deep and possibly infinite.
type Result = Apply<RusselHKT, RusselHKT>;
