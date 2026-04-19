# API Reference

This page combines the exported API reference with the current examples.
Where the original source comments omitted imports, they are still omitted
here.

## Core

### `HKT<TInput = never, TOutput = unknown>`

The base interface for defining a higher-kinded type.

Define a concrete HKT by extending `HKT<InputType>` and writing the result into
`output`, usually in terms of `Input<this>`.

```ts
interface NumberToStringHKT extends HKT<number> {
  output: `${Input<this>}`;
}
```

Use `HKT<InputType, OutputType>` as a generalized constraint when you want to
accept an HKT as an argument.

### `Input<THKT>`

Extracts the input type of an HKT.

When you are defining an HKT, this is also the placeholder for the applied
argument.

### `Apply<THKT, TInput>`

Applies an HKT to an input.

Conceptually, this narrows the HKT's input to `TInput` and then reads the
corresponding `output`.

This is why `Apply` works both with fully decided inputs and with broader,
still-undecided inputs.

### `Output<THKT>`

Extracts the output type of an HKT without applying it to a narrower input.

## Utility HKTs

### `IdHKT<T>`

The identity HKT. Applying it returns the narrowed input unchanged.

<details>
<summary>Example</summary>

```ts
type StringIdHKT = IdHKT<string>;

type Results = [Apply<StringIdHKT, 'abc'>, Apply<StringIdHKT, 'def'>];

// Should be true:
type Assertion = Results extends ['abc', 'def']
  ? ['abc', 'def'] extends Results
    ? true
    : false
  : false;

// Should produce an error "Type 'number' does not satisfy the constraint 'string'":
// type Negative = Apply<StringIdHKT, 123>;
```

</details>

### `ConstHKT<TInput, TOutput>`

An HKT that always returns the same output type.

<details>
<summary>Example</summary>

```ts
type AbcHKT = ConstHKT<string, 'abc'>;

type Results = [Apply<AbcHKT, 'input1'>, Apply<AbcHKT, 'input2'>];

// Should be true:
type Assertion = Results extends ['abc', 'abc']
  ? ['abc', 'abc'] extends Results
    ? true
    : false
  : false;

// Should produce an error "Type 'number' does not satisfy the constraint 'string'":
// type Negative = Apply<AbcHKT, 123>;
```

</details>

### `Pipe<F, G>`

Composes two HKTs. `Pipe<F, G>` first applies `G`, then applies `F` to the
result.

<details>
<summary>Example</summary>

```ts
interface FHKT extends HKT<number, string> {
  output: `f(${Input<this>})`;
}

interface GHKT extends HKT<string, Array<string>> {
  output: [`g(${Input<this>})`];
}

type FRes = Apply<FHKT, 123>;
type GRes = Apply<GHKT, FRes>;

type PipedHKT = Pipe<GHKT, FHKT>;

type PipedRes = Apply<PipedHKT, 123>;

// Should be true:
type Assertion = PipedRes extends GRes ? GRes extends PipedRes ? true : false : false
```

</details>

## Tuple combinators

### `FMap<TF, TArr>`

Maps an HKT over a tuple.

<details>
<summary>Example</summary>

```ts
interface ToStringHKT extends HKT<number> {
  output: `${Input<this>}`;
}

type Arr = [1, 2, 3];

type Result = FMap<ToStringHKT, Arr>;

// Should be true:
type Assertion = Result extends ['1', '2', '3']
  ? ['1', '2', '3'] extends Result
    ? true
    : false
  : false;
```

</details>

### `Filter<TF, TArr>`

Filters a tuple with an HKT predicate.

If the predicate is undecided for some element and returns `boolean`, both
branches are preserved in the result type.

<details>
<summary>Example</summary>

```ts
type Arr = [1, '2', 3, '4', 5];

interface IsStringHKT extends HKT<string | number> {
  output: Input<this> extends string ? true : false;
}

type Filtered = Filter<IsStringHKT, Arr>;

// Should be true:
type Assertion = Filtered extends ['2', '4']
  ? ['2', '4'] extends Filtered
    ? true
    : false
  : false;
```

</details>

<details>
<summary>Advanced example: undecided predicate</summary>

```ts
type ArrAdv = [1, 2, 3];

interface UndecidedHKT extends HKT<string | number> {
  output: boolean;
}

type FilteredAdv = Filter<UndecidedHKT, ArrAdv>;

type ExpectedAdv = [] | [1] | [2] | [3] | [1, 2] | [1, 3] | [2, 3] | [1, 2, 3];

// Should be true:
type AssertionAdv = FilteredAdv extends ExpectedAdv
  ? ExpectedAdv extends FilteredAdv
    ? true
    : false
  : false;
```

</details>

### `Reduce<TTAcc, TF, TInitial, TArr>`

Left-folds a tuple with an HKT reducer. The reducer receives
`{ acc: ..., element: ... }`.

<details>
<summary>Example</summary>

```ts
interface ConcatNumbersHKT extends HKT<{ acc: string; element: number }> {
  output: `${Input<this>['acc']} ${Input<this>['element']}`;
}

type Arr = [1, 23, 456];

type Result = Reduce<string, ConcatNumbersHKT, 'Numbers:', Arr>;

// Should be true:
type Assertion = Result extends 'Numbers: 1 23 456'
  ? 'Numbers: 1 23 456' extends Result
    ? true
    : false
  : false;
```

</details>

## Notes

This implementation is intentionally simple. It does not stratify HKTs, so
self-referential paradoxes are possible.

<details>
<summary>Russel paradox example</summary>

```ts
import { Apply, HKT, Input } from '../src/';

type ArgBase = HKT<ArgBase, boolean>;

interface RusselHKT extends HKT<ArgBase> {
  output: Apply<Input<this>, Input<this>> extends true ? false : true;
}

// Type instantiation is excessively deep and possibly infinite.
type Result = Apply<RusselHKT, RusselHKT>;
```

</details>
