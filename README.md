# Deepmerge Json

[![Build Status](https://travis-ci.org/kleber-swf/deepmerge-json.svg?branch=master)](https://travis-ci.org/kleber-swf/deepmerge-json)
![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/kleber-swf/deepmerge-json.svg)

A simple library to deep merge json files with array operations. Hugely inspired by the awesome [deepmerge](https://github.com/TehShrike/deepmerge) project.

> Note that you can use to merge javascript objects, but the main reason this library was created was to merge json files with optional special operations for array merging.

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

**Explanation:** it deeply merges `right` object into `left` without altering them and their properties. Everything is cloned. Arrays elements are merged based on `right` parameters passed as objects.

## Installation

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


## Usage

The main reason this library was created was to mimic and extend some array merging functions from mongodb when merging two sets of properties json files.


### Simple merge

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


### Array merge

Merging arrays are special because sometimes you want to append elements, sometimes prepend and sometimes you want to merge them.

Mongodb handles this nicely (IMHO). It has a [`$push` property](https://docs.mongodb.com/manual/reference/operator/update/push/) (among others) that let you append elements to an array when updating a document.

Inspired on that this library has the following merging methods (note that to be merged, the arrays can have any depth as long as they have the same path):


#### Merge elements

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


#### #push / #append

You can use the special property `$push` or `$append` to add elements to the end of the "left" array.

```js
const left = [0, 1, 2];
const right = { $push: [3, 4, 5] };
const result = merge(left, right);

// Result
[0, 1, 2, 3, 4, 5]

```


#### #prepend

Similarly, you can use the property `$prepend` to add elements to the beginning od the "left" array.

```js
const left = [0, 1, 2];
const right = { $prepend: [-2, -1] };
const result = merge(left, right);

// Result
[-2, -1, 0, 1, 2]

```


#### #set

Use `#set` when you want to completely replace "left" array by the "right" one.

```js
const left = [0, 1, 2, 3, 4, 5, 6];
const right = { $set: [10, 20] };
const result = merge(left, right);

// Result
[10, 20]

```


#### Skipping elements

If you skip some elements in the "right" array, the respective "left" elements will be kept in the result. This is not very useful for json merging since it's ot possible to create a sparse array _per se_, but it's a nice consequence of the `merge` method.

```js
const left = [1, 20, 3, 40, 5, 60];
const right = [10, , 30, , 50];
const result = merge(left, right);

// Result
[10, 20, 30, 40, 50, 60]

```

### Options

For now, no options yet.


## Contributing

If you are nice enough you can submit bugs and features to the issue board and make this lib great and useful for you and the community.

But if you are really nice you can submit a PR and make this lib awesome!

