export type ValueObject = Record<string, any>;

export type StringSet = Set<string>;

export interface ObjectSchema {
    objs: ValueObject[];
    stringsKeys: Set<string>;
    stringArraysKeys: Set<string>;
}


function analyzeObject(obj: ValueObject, stringsKeys: StringSet, stringArraysKeys: StringSet): void {
    for (const [key, val] of Object.entries(obj)) {
        const propType = typeof(val);
        
        if (propType === 'string') {
            stringsKeys.add(key);
        } else if (propType === 'object') {
            if (Array.isArray(val)) {
                stringArraysKeys.add(key);
            }
        }
    }

}

export function extractSchemaFromObjects(objs: ValueObject[]): ObjectSchema {
    const stringsKeys: Set<string> = new Set();
    const stringArraysKeys: Set<string> = new Set();

    for (const obj of objs) {
        analyzeObject(obj, stringsKeys, stringArraysKeys);
    }

    return {
        objs,
        stringsKeys,
        stringArraysKeys
    }
}