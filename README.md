# yet-another-hkt ― this time very simple

[![npm](https://img.shields.io/npm/v/yet-another-hkt.svg)](https://www.npmjs.com/package/yet-another-hkt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

`yet-another-hkt` is a small type-level toolkit for higher-kinded types in TypeScript.
It gives you a minimal HKT encoding and a few tuple combinators built on top of
it. The package is meant for the type system, not for runtime logic and takes up about 50 lines of type-level code
## Installation

```bash
npm install yet-another-hkt
```

## Core idea

In this package, an HKT is an interface with an input slot and an output slot.
You define the output in terms of `Input<this>`.

```ts
import type { Apply, HKT, Input } from 'yet-another-hkt';

interface ToStringHKT extends HKT<number | boolean> {
  output: `${Input<this>}`;
}

type ConcreteResult = Apply<ToStringHKT, 123>; // '123'
type UnionResult = Apply<ToStringHKT, 123 | true>; // '123' | 'true'
type GeneralResult = Apply<ToStringHKT, number>; // `${number}`
```

One useful way to read `Apply<F, A>` is:

1. Narrow the input type of `F` to `A`.
2. Read back the resulting output type.

TypeScript can reason about both "decided" and "undecided"
types. If the input is concrete, the result can become concrete. If the input
is still broad, the result stays broad. If a computation cannot decide between
branches, the result can keep those branches instead of collapsing them.

`Filter` is the clearest example. If its predicate is "undecided" for some
element and returns `boolean`, the result becomes a union of the tuples where
that element is kept and where it is removed. See the advanced `Filter`
example in [docs/reference.md](docs/reference.md).

## API

Core:

- `HKT<TInput = never, TOutput = unknown>`
- `Input<THKT>`
- `Apply<THKT, TInput>`
- `Output<THKT>`

Utilities:

- `IdHKT<T>`
- `ConstHKT<TInput, TOutput>`
- `Pipe<F, G>`
- `FMap<TF, TArr>`
- `Filter<TF, TArr>`
- `Reduce<TTAcc, TF, TInitial, TArr>`

## Documentation

- [Reference and examples](docs/reference.md)
- [Paradox example](docs/reference.md#notes)

## Notes

This implementation is intentionally simple. It does not stratify HKTs, so
self-referential paradoxes are possible. When that happens, TypeScript usually
reports that type instantiation became excessively deep and possibly infinite.
See the example in `examples/russelParadox.ts`.
