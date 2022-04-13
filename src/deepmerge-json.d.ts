/**
 * Deeply merge objects. Second parameter properties override the
 * ones with the same path in the first object.
 * 
 * Arrays can be merged or changed with `$push`, `$prepend`, `$set`, `$replace` or `$insert`
 * operations. Multiple operations can be passed.
 * 
 * @see {@link https://github.com/kleber-swf/deepmerge-json#readme}
 * @param pre Base object
 * @param pos Object that will overrite base properties. If none is given, the first object is
 * 			  deeply cloned
 * @returns A deep clone object containing a combination of all
 * 			properties from pre and pos arguments.
 */
declare function merge<T1, T2>(pre: Partial<T1>, pos?: Partial<T2>): T1 & T2;

export default merge;