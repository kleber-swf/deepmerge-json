/**
 * Deeply merge objects. Second parameter properties override the
 * ones with the same path in the first object.
 * 
 * Arrays can be merged or changed with `$push` (or `$append`),
 * `$prepend` or `$set` methods.
 * 
 * @see {@link https://github.com/kleber-swf/deepmerge-json#readme}
 * @param first Base object
 * @param second Object that will overrite base properties
 * @returns A deep clone object containing a combination of all
 * 			properties from first and second arguments.
 */
declare function merge<T1, T2>(first: Partial<T1>, second: Partial<T2>): T1 & T2;

export default merge;