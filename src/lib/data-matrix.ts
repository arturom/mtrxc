import type { StringSet, ValueObject } from "./object-schema";

export type DataMatrix = Map<string, Set<string>>;

export class MatrixBuilder {
    map: DataMatrix = new Map();
    ids: StringSet = new Set();

    addStringValue(id: string, value: string) {
        if (!this.map.has(value)) {
            this.map.set(value, new Set());
        }

        const set = this.map.get(value);
        set?.add(id);
        this.ids.add(id);
    }

    addStringValues(id: string, values: string[]) {
        for (const value of values) {
            this.addStringValue(id, value);
        }
    }
}

export function createMatrixWithArrayValue(objs: ValueObject[], idKey: string, valueKey: string): MatrixBuilder {
    const builder = new MatrixBuilder();
    for (const obj of objs) {
        const idVal: string = obj[idKey];
        const values: string[] = obj[valueKey];
        builder.addStringValues(idVal, values);
    }
    return builder;
}

export function createMatrixWithStringValue(objs: ValueObject[], idKey: string, valueKey: string): MatrixBuilder {
    const matrix: DataMatrix = new Map();
    const builder = new MatrixBuilder();
    for (const obj of objs) {
        const idVal: string = obj[idKey];
        const value: string = obj[valueKey];
        builder.addStringValue(idVal, value);
    }
    return builder;
}