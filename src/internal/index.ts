/**
 * The base interface for a higher-kinded type.
 *
 * Define a concrete HKT by extending `HKT<InputType>` and writing the result
 * type into `output` in terms of `Input<this>`.
 *
 * Example:
 * ```
 * interface NumberToStringHKT extends HKT<number> {
 *   output: `${Input<this>}`;
 * }
 * ```
 *
 * A generalized HKT constraint can be written directly as `HKT<InputType,
 * OutputType>`.
 *
 * @template TInput The accepted input type. Defaults to `never`.
 * @template TOutput The produced output type. Defaults to `unknown`.
 * Specify `TOutput` mainly for generalized HKTs, for example when accepting an
 * HKT as an argument. Specifying `TOutput` for a concrete HKT you define is
 * usually unnecessary and possibly a bad practice.
 */
export interface HKT<TInput = never, TOutput = unknown> {
  type: (input: TInput) => never;
  output: TOutput;
}

/**
 * Extracts the input type of an HKT.
 *
 * When defining an HKT, use it as the placeholder for the applied argument:
 * ```
 * interface NumberToStringHKT extends HKT<number> {
 *   output: `${Input<this>}`;
 * }
 * ```
 *
 * It can also be used directly to inspect an HKT:
 * ```
 * type NumberToStringInput = Input<NumberToStringHKT>; // number
 * ```
 */
export type Input<THKT extends HKT> = Parameters<THKT['type']>[0];

/**
 * Applies an HKT to an input.
 *
 * Internally this narrows the HKT's input field to the provided argument type
 * and then reads back the corresponding `output`.
 *
 * Example:
 * ```
 * interface ToStringHKT extends HKT<number | boolean> {
 *   output: `${Input<this>}`;
 * }
 *
 * type ConcreteResult = Apply<ToStringHKT, 123>; // '123'
 * ```
 *
 * The input does not need to be fully decided:
 * ```
 * type UnionResult = Apply<ToStringHKT, 123 | true>; // '123' | 'true'
 * ```
 * ```
 * type GeneralResult = Apply<ToStringHKT, number>; // `${number}`
 * ```
 */
export type Apply<THKT extends HKT, TInput extends Input<THKT>> = Output<
  NarrowInput<THKT, TInput>
>;

/**
 * Extracts the output type of an HKT without applying it to a narrower input.
 *
 * Example:
 * ```
 * interface TupleOfThreeHKT extends HKT<number> {
 *   output: [Input<this>, Input<this>, Input<this>];
 * }
 *
 * type Result = Output<TupleOfThreeHKT>; // [number, number, number]
 * ```
 */
export type Output<THKT extends HKT> = THKT['output'];

/**
 * Narrows an HKT's input type while keeping the same structure.
 *
 * This is the operation behind `Apply`.
 *
 * Example:
 * ```
 * interface TupleOfThreeHKT extends HKT<number | string> {
 *   output: [Input<this>, Input<this>, Input<this>];
 * }
 *
 * type Original = Output<TupleOfThreeHKT>; // [number | string, number | string, number | string]
 * type Narrowed = NarrowInput<TupleOfThreeHKT, number>;
 * type Result = Output<Narrowed>; // [number, number, number]
 * ```
 */
export type NarrowInput<THKT extends HKT, TInput extends Input<THKT>> = THKT &
  InputNarrower<TInput>;

type InputNarrower<TInput> = {
  type: (input: TInput) => never;
};
