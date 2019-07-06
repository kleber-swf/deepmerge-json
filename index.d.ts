declare function merge<T>(first: Partial<T>, second: Partial<T>): T;
declare function merge<T1, T2>(first: Partial<T1>, second: Partial<T2>): T1 & T2;

export default merge;