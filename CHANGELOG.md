# Changelog

## [1.5.0] - 2022-02-08

### Added

-   `merge` operation. It should be used instead of `$replace`. It works like `$replace` was before `1.4.0`. It merges objects when the index is found and add them when the index is missing.

--

## [1.4.0] - 2022-02-08

### Changed

-   `replace` method now does what it suppose to do: it "replaces" individual array elements instead of merging the old ones with the new.

### Fixed

-   Avoiding the infamous [prototype pollution](https://learn.snyk.io/lessons/prototype-pollution/javascript/) problem

---

## [1.3.2] - 2022-13-04

### Added

-   Automatic generation of `d.ts` file, keeping Typescript users happy effortlessly
-   Documentation for `clone` and `multi` methods

### Fixed

-   Last changes were not inside the the `d.ts` file

---

## [1.3.0] - 2022-12-04

### Added:

-   Support to multiple operations at once
-   Clone functionality with an empty second parameter.
-   Proper `clone` method which is a more meaninful named alias to the functionality
-   `merge.multi` an utility method to merge multiple objects at once, respecting their order

### Fixed:

-   Result was being replaced by an empty `pos` parameter. This fix can be a breaking change if your code rely on this behavior. This was wrongly assuming that if you pass any _falsey_ `pos` parameter it meant you wanted to replace the entire `pre` parameter with it. Now it works like this: if you pass nothing (`undefined`) to the `pos` parameter, the `pre` parameter will be cloned as is. If you pass anything else, it will be used in the merge process as expected.
-   README titles
-   Travis configuration file

---

## [1.2.0] - 2021-08-06

### Changed

-   Added support to negative indexes to `$insert` operation

---

## [1.1.3] - 2021-08-05

### Added

-   New array operation: `$insert`

### Changed

-   Now `$replace` accept string numeric keys

---

## [1.1.1] - 2020-11-02

### Changed

-   Changed the name of the generated artifacts for better integration with other libraries
    -   from "index.js" to "deepmerge-json.js"
    -   from "index.d.js" to "deepmerge-json.d.js"
-   Source code mode to src folder to keep thing organized

---

## [1.1.0] - 2020-03-27

### Added

-   New array operation: `$replace`

### Fixed

-   Fixed security issues with some dependencies

---

## [1.0.2] - 2019-07-22

### Fixed

-   Arrays of objects were not being merged

### Added

-   `$push` tests

---

## [1.0.0] - 2019-07-07

Initial version

[unreleased]: https://github.com/kleber-swf/deepmerge-json/tree/develop
[1.5.0]: https://github.com/kleber-swf/deepmerge-json/tree/v1.5.0
[1.4.0]: https://github.com/kleber-swf/deepmerge-json/tree/v1.4.0
[1.3.2]: https://github.com/kleber-swf/deepmerge-json/tree/v1.3.2
[1.3.0]: https://github.com/kleber-swf/deepmerge-json/tree/v1.3.0
[1.2.0]: https://github.com/kleber-swf/deepmerge-json/tree/v1.2.0
[1.1.3]: https://github.com/kleber-swf/deepmerge-json/tree/v1.1.3
[1.1.1]: https://github.com/kleber-swf/deepmerge-json/tree/v1.1.1
[1.1.0]: https://github.com/kleber-swf/deepmerge-json/tree/v1.1.0
[1.0.2]: https://github.com/kleber-swf/deepmerge-json/tree/v1.0.2
[1.0.0]: https://github.com/kleber-swf/deepmerge-json/tree/v1.0.0
