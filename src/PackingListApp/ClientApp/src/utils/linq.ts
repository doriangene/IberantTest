declare global {
    interface IEnumerable<TSource> {
        any(predicate?: (x: TSource) => boolean): boolean;
        all(predicate?: (x: TSource) => boolean): boolean;
        sum(predicate: (x: TSource) => number): number;
        first(predicate?: (x: TSource) => boolean): TSource;
        firstOrDefault(predicate?: (x: TSource) => boolean): TSource | null;
        orderBy<TKey>(predicate: (x: TSource) => TKey): IEnumerable<TSource>;
        orderByDescending<TKey>(predicate: (x: TSource) => TKey): IEnumerable<TSource>;
        groupBy<TKey>(keySelector: (x: TSource) => TKey, groupSorter?: (g1: IGroup<TKey, TSource>, g2: IGroup<TKey, TSource>) => number): IEnumerable<IGroup<TKey, TSource>>;
        toArray<TSource>(): TSource[];
    }
    interface Array<T> extends IEnumerable<T> { }
    interface Uint8Array extends IEnumerable<number> { }
    interface Uint8ClampedArray extends IEnumerable<number> { }
    interface Uint16Array extends IEnumerable<number> { }
    interface Uint32Array extends IEnumerable<number> { }
    interface Int8Array extends IEnumerable<number> { }
    interface Int16Array extends IEnumerable<number> { }
    interface Int32Array extends IEnumerable<number> { }
    interface Float32Array extends IEnumerable<number> { }
    interface Float64Array extends IEnumerable<number> { }
    interface Map<K, V> extends IEnumerable<[K, V]> { }
    interface Set<T> extends IEnumerable<T> { }
    interface String extends IEnumerable<string> { }
}

function firstOrDefault<TSource>(this: any, predicate?: (x: TSource) => boolean): TSource | null {
    let self = this;
    if ((this instanceof Set) || (this instanceof Map)) {
        self = this.toArray();
    }
    if (predicate) {
        let idx = 0;
        while (idx < self.length && !predicate(self[idx])) {
            idx++;
        }
        return idx < self.length ? self[idx] : null;
    }
    return (self.length > 0) ? self[0] : null;
}

function first<TSource>(this: any, predicate?: (x: TSource) => boolean): TSource {
    const item = this.firstOrDefault(predicate);
    if (!item) {
        throw new Error('Item not found in collection');
    }
    return item;
}

function any<TSource>(this: any, predicate?: (x: TSource) => boolean): boolean {
    return this.filter(predicate).length>0;
}

function all<TSource>(this: any, predicate: (x: TSource) => boolean): boolean {
    return this.filter((o: any) => !predicate(o)).length == 0;
}

function sum<TSource>(this: any, predicate: (x: TSource) => number): number {
    let sum = 0;
    let self = this;
    if ((this instanceof Set) || (this instanceof Map)) {
        self = this.toArray();
    }
    let idx = 0;
    while (idx < self.length) {
        sum += predicate(self[idx]);
        idx++;
    }
    return sum;
}

function orderBy<TSource, TKey>(this: any, predicate: (x: TSource) => TKey): IEnumerable<TSource> {
    let self = this;
    if ((this instanceof Set) || (this instanceof Map) || (this instanceof String) || (typeof this === 'string')) {
        self = this.toArray();
    }

    return self.sort((n1: any, n2: any) => {
        if (predicate(n1) > predicate(n2)) {
            return 1;
        }
        if (predicate(n1) < predicate(n2)) {
            return -1;
        }
        return 0;
    });
}

function orderByDescending<TSource, TKey>(this: any, predicate: (x: TSource) => TKey): IEnumerable<TSource> {
    let self = this;
    if ((this instanceof Set) || (this instanceof Map) || (this instanceof String) || (typeof this === 'string')) {
        self = this.toArray();
    }

    return self.sort((n1: any, n2: any) => {
        if (predicate(n1) < predicate(n2)) {
            return 1;
        }
        if (predicate(n1) > predicate(n2)) {
            return -1;
        }
        return 0;
    });
}

export interface IGroup<TKey, TSource> {
    key: TKey;
    items: TSource[];
}

function groupBy<TSource, TKey>(this: any, keySelector: (x: TSource) => TKey, groupSorter?: (g1: IGroup<TKey, TSource>, g2: IGroup<TKey, TSource>) => number): IEnumerable<IGroup<TKey, TSource>> {
    let self = this;
    if ((this instanceof Set) || (this instanceof Map) || (this instanceof String) || (typeof this === 'string')) {
        self = this.toArray();
    }

    const g = self.reduce((groups: any, item: TSource) => {
        const key = keySelector(item);
        groups[key] = groups[key] || { key, items: [] } as IGroup<TKey, TSource>;
        groups[key].items.push(item);
        return groups;
    }, {});
    const result = [] as IGroup<TKey, TSource>[];
    for (const key in g) {
        if (g.hasOwnProperty(key)) {
            result.push(g[key]);
        }
    }

    if (groupSorter) {
        return result.sort(groupSorter);
    }

    return result;
}

function toArray<TSource>(this: any): TSource[] {
    if ((this instanceof String) || (typeof this === 'string')) {
        return this.split('') as unknown as TSource[];
    }
    if ((this instanceof Set) || (this instanceof Map)) {
        const arr: any[] = [];
        this.forEach((e: any) => {
            arr.push(e);
        });
        return arr;
    }
    return [...this];
}

function bindLinqFunctions(enumerable: any) {
    enumerable.prototype['toArray'] = toArray;
    enumerable.prototype['firstOrDefault'] = firstOrDefault;
    enumerable.prototype['first'] = first;
    enumerable.prototype['any'] = any;
    enumerable.prototype['all'] = all;
    enumerable.prototype['orderBy'] = orderBy;
    enumerable.prototype['orderByDescending'] = orderByDescending;
    enumerable.prototype['groupBy'] = groupBy;
    enumerable.prototype['sum'] = sum;
}

bindLinqFunctions(String);
bindLinqFunctions(Array);
bindLinqFunctions(Map);
bindLinqFunctions(Set);
bindLinqFunctions(Int8Array);
bindLinqFunctions(Int16Array);
bindLinqFunctions(Int32Array);
bindLinqFunctions(Uint8Array);
bindLinqFunctions(Uint8ClampedArray);
bindLinqFunctions(Uint16Array);
bindLinqFunctions(Uint32Array);
bindLinqFunctions(Float32Array);
bindLinqFunctions(Float64Array);

export { };