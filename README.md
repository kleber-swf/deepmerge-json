# Deepmerge Json

[![Build Status](https://travis-ci.org/kleber-swf/deepmerge-json.svg?branch=master)](https://travis-ci.org/kleber-swf/deepmerge-json)
![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/kleber-swf/deepmerge-json.svg)
![npm](https://img.shields.io/npm/v/deepmerge-json)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/kleber-swf/deepmerge-json)

# What

A simple library to deep merge json files with array operations. Hugely inspired by the awesome [deepmerge](https://github.com/TehShrike/deepmerge) project.

> Note that you can use to merge javascript objects, but the main reason this library was created was to merge json files with optional special operations for array merging.

# Why

Sometimes you need a deeply copied objects. Sometimes you need to alter these objects to make them more extensible and generic, specially when you are using [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) or [convention over code](https://en.wikipedia.org/wiki/Convention_over_Code) patterns.

The objective of this library is to help you with these situations being really simple, performatic and small (~1.5kb).

# How

```js
let left = {
  keep: 'keep',
  simple: 10,
  obj: { a: { multi: { level: 'property' } }, is: 'ok' },
  merge: [0, 1, 2, 3],
  append: [0, 1, 2],
  prepend: [0, 1, 2]
};

let right = {
  simple: 20,
  obj: { a: { multi: { level: 'and' }, deep: 'property' } },
  merge: [10, 20],
  append: { $append: [3, 4, 5] },
  prepend: { $prepend: [-2, -1] }
};

let result = merge(left, right);
console.log(result);

// Result
{
  keep: 'keep',
  simple: 20,
  obj: { a: { multi: { level: 'and' }, deep: 'property' }, is: 'ok' },
  merge: [10, 20, 2, 3],
  append: [0, 1, 2, 3, 4, 5],
  prepend: [-2, -1, 0, 1, 2]
}
```

**Explanation:** it deeply merges `right` object into `left` without altering them and their properties. Everything is cloned. Arrays elements are merged based on `right` parameters (operators) passed as objects.

# Installation

## With NPM

```sh
npm install deepmerge-json
```

After that you can import it:

```js
import merge from 'deepmerge-json';
```

or

```js
const merge = require('deepmerge-json');
```

There is even a Typescript `d.ts` definition file to support auto complete.

## With a CDN

Just add this line to your HTML file:

```html
<script src="https://unpkg.com/deepmerge-json@latest/dist/deepmerge-json.min.js></script>
```

# Usage

The main reason this library was created was to mimic and extend some array merging functions from mongodb when merging two sets of properties json files.

## Simple Merge

It is possible to merge recursively all types of properties.

```js
const left = {
  boolValue: false,
  numberValue: 100,
  stringValue: 'target',
  objectValue: {
    foo: 0,
    bar: 'bar',
    baz: {
      baz1: 1,
      baz2: 2
    }
  }
};

const right = {
  boolValue: true,
  numberValue: 222,
  stringValue: 'source',
  objectValue: {
    foo: 'foo',
    baz: {
      baz3: 3
    }
  }
};

const res = merge(left, right);

// result
{
  boolValue: true,
  numberValue: 222,
  stringValue: 'source',
  objectValue: {
    foo: 'foo',
    bar: 'bar',
    baz: {
      baz1: 1,
      baz2: 2,
      baz3: 3
    }
  }
}
```

## Clone

You can clone an object omitting the second parameter. This will execute the `merge` function with an empty second parameter, which results in a deep clone of the first one.

Notice that if you pass anything other than `undefined` to the second parameter (even `null`), it will be actively used in the merge process.

You can also use the `merge.clone()` method which is an alias to the `merge` method with a single parameter. It's also more semantically meaningful.

## Array Merge

Merging arrays are special because sometimes you want to append elements, sometimes prepend and sometimes you want to merge them.

Mongodb handles this nicely (IMHO). It has a [`$push` property](https://docs.mongodb.com/manual/reference/operator/update/push/) (among others) that let you append elements to an array when updating a document.

Inspired on that, this library has some merging methods (here called **operations**) to help you merge or improve the arrays from the original object. Just keep in mind that no matter the depth of the array, you just need to have the same path to the objects you want to merge.

### Merging Elements

This is the default behavior. It merges the arrays elements one by one. It will add elements to the end if there more on the right than on the left element.

```js
const left = {
  foo: [1, 2, 3],
  bar: []
};

const right = {
  foo: [10, 20],
  bar: [10, 20, 30]
};

const result = merge(left, right)

// Result
{
  foo: [10, 20, 3],
  bar: [10, 20, 30]
}
```

### $push / $append

You can use the `$push` or `$append` operation to add elements to the end of the "left" array.

```js
const left = [0, 1, 2];
const right = { $push: [3, 4, 5] };
const result = merge(left, right);

// Result
[0, 1, 2, 3, 4, 5];
```

### $prepend

Similarly, you can use `$prepend` operation to add elements to the beginning of the "left" array.

```js
const left = [0, 1, 2];
const right = { $prepend: [-2, -1] };
const result = merge(left, right);

// Result
[-2, -1, 0, 1, 2];
```

### $set

Use `$set` when you want to completely replace "left" array by the "right" one.

```js
const left = [0, 1, 2, 3, 4, 5, 6];
const right = { $set: [10, 20] };
const result = merge(left, right);

// Result
[10, 20];
```

### $replace

Use `$replace` to replace or add indexed elements by their indexes. Indexes can be numbers or strings and cannot be less than 0 or `NaN` values.

#### With valid indexes:

```js
const left = [10, 20, 30];
const right = { $replace: { 0: 100, 2: 300, 4: 400 } };
const result = merge(left, right);

// Result (note that the element with index 3 was never given)
[100, 20, 300, , 400];
```

#### With invalid indexes:

```js
const left = [10, 20, 30];
const right = { $replace: { null: 0, foo: 0, true: 0, '-1': 0 } };
const result = merge(left, right);

// throws an Error
```

#### With objects

`[1.4.0]` It completely replaces the indicated left element with the corresponding right element.

> **Note for users of version `< 1.4.0`**: if you want the old operation functionality, replace `$replace` for [`$merge`](#merge).

```js
const left = [{ a: 1, b: 1 }, { c: 1 }];
const right = { $merge: [{ a: 2 }] };
const result = merge(left, right);

// Result
[{ a: 2 }, { c: 1 }];
```

### $merge

Use `$merge` to merge or add indexed elements by their indexes. Indexes can be numbers or strings and cannot be less than 0 or `NaN` values. It's similar to [`$replace`](#replace) but instead of replacing the values when found, it merges them with the new values.

#### With valid indexes:

```js
const left = [10, 20, 30];
const right = { $merge: { 0: 100, 2: 300, 4: 400 } };
const result = merge(left, right);

// Result (note that the element with index 3 was never given)
[100, 20, 300, , 400];
```

#### With invalid indexes:

```js
const left = [10, 20, 30];
const right = { $merge: { null: 0, foo: 0, true: 0, '-1': 0 } };
const result = merge(left, right);

// throws an Error
```

#### With objects

```js
const left = [{ a: 1, b: 1 }, { c: 1 }];
const right = { $merge: [{ a: 2 }] };
const result = merge(left, right);

// Result
[{ a: 2, b: 1 }, { c: 1 }];
```

### $insert

Use `$insert` to insert indexed elements at their indexes. Indexes can be numbers or strings and cannot `NaN` values. Notice that elements change places as you insert them. Negative numbers insert them to the end of the array. See [Array.splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

#### With positive indexes:

```js
const left = [10, 20, 30];
const right = { $insert: { 0: 100, 2: 200, 10: 400 } };
const result = merge(left, right);

// Result (notice that the elements moved and the 400 was added to the last index)
[100, 10, 200, 20, 30, 400];
```

#### With negative indexes:

```js
const left = [10, 20, 30];
const right = { $insert: { '-1': 100, '-2': 200, '-10': 0 } };
const result = merge(left, right);

// Result
[0, 10, 20, 200, 100, 30];
```

#### With invalid indexes:

```js
const left = [10, 20, 30];
const right = { $insert: { null: 100, foo: 300, true: 400 } };
const result = merge(left, right);

// throws an Error
```

### Skipping Elements

If you skip some elements in the "right" array, the respective "left" elements will be kept in the result. This is not very useful for json merging since it's ot possible to create a sparse array _per se_, but it's a nice consequence of the `merge` method.

```js
const left = [1, 20, 3, 40, 5, 60];
const right = [10, , 30, , 50];
const result = merge(left, right);

// Result
[10, 20, 30, 40, 50, 60];
```

### Multiple Operations

Starting from version `1.3.0` it's possible to use multiple operations at once. They are executed in place and in order.

```js
const left = [2, 3, 4];
const right: {
  $prepend: [0, 1],
  $append: [5, 6],
  $replace: { 0: 100 };
}
const result = merge(left, right);

// Result
[100, 1, 2, 3, 4, 5, 6]
```

```js
const left = [2, 3, 4];
const right: {
  $replace: { 0: 100 };
  $prepend: [0, 1],
  $append: [5, 6],
}
const result = merge(left, right);

// Result
[0, 1, 100, 3, 4, 5, 6]
```

## Merging Multiple Objects

You can also merge multiple objects with the help of the utility method `merge.multi()`. It respects the order of the parameters and the operations just like expected if you call `merge` multiple times passing the last result as the first parameter to the next call.

```js
const obj1 = { a: 0, b: [true, { c: 'ok' }] };
const obj2 = { a: 10, d: false };
const obj3 = { a: 20, b: { $push: [42] } };

const result = merge.multi(obj1, obj2, obj3);

// Result
{ a: 20, b: [true, { c: 'ok' }, 42], d: false }
```

## Options

For now, no options yet :chipmunk:.

# Contributing

If you are nice enough you can submit bugs and features to the issue board and make this lib great and useful for you and the community.

But if you are really nice you can submit a PR and make this lib awesome!

# Rough Performance Test

Just a fun performance test with a 1 million runs. I'm not a performance expert so they might not be very precise.

Testing machine:

-   CPU: Intel Core i5-9300H @ 2.4GHz x8
-   Memory: 32GB
-   SO: Ubuntu 20.04.4 LTS

| Measures            | Node 17.7.2 | Chrome 100.0.4896.75 | Firefox 99.0 <sup>2</sup> :thinking: |
| ------------------- | ----------- | -------------------- | ------------------------------------ |
| Max. Value          | 279,763.93  | 295,386.07           | 852,514.92                           |
| Min. Value          | 277,344.35  | 287,802.91           | 827,814.57                           |
| Average<sup>1</sup> | 279,574.05  | 293,929.66           | 840,884.13                           |

-   Operations per second
-   <sup>1</sup> The average is calculated removing the maximum and the minimum values
-   <sup>2</sup> For some reason Firefox returned a really good but suspicious performance
