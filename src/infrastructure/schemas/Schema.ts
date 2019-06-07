/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-use-before-define */

/**
 * In bytes
 * @type {{BYTE: number, SHORT: number, INT: number}}
 */
export const TypeSize = {
    BYTE: 1,
    SHORT: 2,
    INT: 4,
};

/**
 * @param {string} name Attribute name
 * @returns {ScalarAttribute} return ScalarAttribute Instance
 */
export const ubyte = (name) => {
    return new ScalarAttribute(name, TypeSize.BYTE);
};

/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export const byte = (name) => {
    return new ScalarAttribute(name, TypeSize.BYTE);
};

/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export const ushort = (name) => {
    return new ScalarAttribute(name, TypeSize.SHORT);
};

/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export const short = (name) => {
    return new ScalarAttribute(name, TypeSize.SHORT);
};

/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export const uint = (name) => {
    return new ScalarAttribute(name, TypeSize.INT);
};

/**
 *
 * @param {string} name Attribute Name
 * @returns {ScalarAttribute} ScalarAttribute Instance
 */
export const int = (name) => {
    return new ScalarAttribute(name, TypeSize.INT);
};

/**
 *
 * @param {string} name Attribute Name
 * @param {number} typeSize Attribute Byte Size
 * @returns {ArrayAttribute} ArrayAttribute Instance
 */
export const array = (name, typeSize = TypeSize.BYTE) => {
    return new ArrayAttribute(name, typeSize);
};

/**
 *
 * @param {string} name Attribute Name
 * @returns {ArrayAttribute} ArrayAttribute Instance
 */
export const string = (name) => {
    return array(name);
};

/**
 *
 * @param {string} name Attribute Name
 * @param {module:schema/Schema} schema Table Specific Schema definition
 * @returns {TableAttribute} TableAttribute Instance
 */
export const table = (name, schema) => {
    return new TableAttribute(name, schema);
};

/**
 *
 * @param {string} name Attribute Name
 * @param {module:schema/Schema} schema Schema Definition
 * @returns {TableArrayAttribute} TableAttribute Instance
 */
export const tableArray = (name, schema) => {
    return new TableArrayAttribute(name, schema);
};

/* eslint-disable */
const readInt32 = (offset, bytes) => {
    return bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16 | bytes[offset + 3] << 24;
};

const readInt16 = (offset, bytes) => {
    return bytes[offset] | bytes[offset + 1] << 8;
};

const __offset = (val0, fieldPos, bytes) => {
    const vtable = val0 - readInt32(val0, bytes);
    return fieldPos < readInt16(vtable, bytes) ? readInt16(vtable + fieldPos, bytes) : 0;
};

const __vector_length = (offset, bytes) => {
    return readInt32(offset + readInt32(offset, bytes), bytes);
};

const __indirect = (offset, bytes) => {
    return offset + readInt32(offset, bytes);
};

const __vector = (offset, bytes) => {
    return offset + readInt32(offset, bytes) + 4;
};

const findVector = (val0, fieldPos, bytes, size) => {
    const offset = __offset(val0, fieldPos, bytes);
    const offsetLong = offset + val0;
    const vecStart = __vector(offsetLong, bytes);
    const vecLength = __vector_length(offsetLong, bytes) * (size ? size : 1);
    return offset ? bytes.slice(vecStart, vecStart + vecLength) : 0;
};

const findParam = (val0, fieldPos, bytes, numBytes) => {
    const offset = __offset(val0, fieldPos, bytes);
    return offset ? bytes.slice(offset + val0, offset + val0 + numBytes) : 0;
};

const findObjectStartPosition = (val0, fieldPos, bytes) => {
    const offset = __offset(val0, fieldPos, bytes);
    return __indirect(offset + val0, bytes);
};

const findArrayLength = (val0, fieldPos, bytes) => {
    const offset = __offset(val0, fieldPos, bytes);
    return offset ? __vector_length(val0 + offset, bytes) : 0;
};

const findObjectArrayElementStartPosition = (val0, fieldPos, bytes, index) => {
    const offset = __offset(val0, fieldPos, bytes);
    const vector = __vector(val0 + offset, bytes);
    return __indirect(vector + index * 4, bytes);
};

/**
 * Schema
 * @module schema/Schema
 */
export class Schema {
    schemaDefinition;
    /**
     * @constructor
     * @param {Array.<Attribute>} schemaDefinition Schema Definition
     */
    constructor(schemaDefinition) {
        this.schemaDefinition = schemaDefinition;
    }

    /**
     *
     * @param {Uint8Array} bytes flatbuffers bytes
     * @returns {Uint8Array} catapult buffer
     */
    serialize(bytes) {
        let i = 0;
        let resultBytes = [];
        while (i < this.schemaDefinition.length) {
            resultBytes = resultBytes.concat(this.schemaDefinition[i].serialize(bytes, 4 + (i * 2)));
            i++;
        }
        return resultBytes;
    }

    /**
     * @param {Uint8Array} bytes flatbuffer bytes
     * @returns {Array} Array with field name + payload
     */
    debugSerialize(bytes) {
        let i = 0;
        let result: any = [];
        while (i < this.schemaDefinition.length) {
            result = result.concat({
                name: this.schemaDefinition[i].name,
                bytes: this.schemaDefinition[i].debugSerialize(bytes, 4 + i * 2),
            });
            i++;
        }
        return result;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Attribute {
    name: any;
    /**
     * @constructor
     * @param {string} name schema attribute name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     *
     * @param {Uint8Array} buffer flatbuffer bytes
     * @param {number} position attribute possition in flatbuffer bytes
     * @param {number} val0 position in case that it is an inner object
     */
    serialize(buffer, position, val0 = undefined) {
        throw new Error('Unimplemented method');
    }

    /**
     * @suppress warnings
     * @param {Uint8Array} buffer buffer flatbuffer bytes
     * @param {number} position attribute possition in flatbuffer bytes
     * @param {number} val0 position in case that it is an inner object
     */
    debugSerialize(buffer, position, val0 = undefined) {
        throw new Error('Unimplemented method');
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ScalarAttribute extends Attribute {
    typeSize: any;
    name: any;
    /**
     * @constructor
     * @param {string} name schema attribute name
     * @param {number} typeSize
     */
    constructor(name, typeSize) {
        super(name);
        this.typeSize = typeSize;
    }

    serialize(buffer, position, val0 = undefined) {
        return findParam(val0 ? val0 : buffer[0], position, buffer, this.typeSize);
    }

    debugSerialize(buffer, position, val0 = undefined) {
        return {
            name: this.name,
            bytes: this.serialize(buffer, position, val0),
        };
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ArrayAttribute extends Attribute {
    typeSize: any;
    name: any;
    /**
     * @constructor
     * @param name - {string}
     * @param typeSize - {TypeSize}
     */
    constructor(name, typeSize) {
        super(name);
        this.typeSize = typeSize;
    }

    serialize(buffer, position, val0 = undefined) {
        return findVector(val0 ? val0 : buffer[0], position, buffer, this.typeSize);
    }

    debugSerialize(buffer, position, val0 = undefined) {
        return {
            name: this.name,
            bytes: this.serialize(buffer, position, val0),
        };
    }
}

// tslint:disable-next-line:max-classes-per-file
export class TableAttribute extends Attribute {
    schema: any;
    name: any;
    /**
     *
     * @param {string} name
     * @param {module:schema/Schema} schema
     */
    constructor(name, schema) {
        super(name);
        this.schema = schema;
    }

    serialize(bytes, position, val0 = undefined) {
        let result = [];
        const messageStartPosition = findObjectStartPosition(val0 ? val0 : bytes[0], position, bytes);
        let i = 0;
        while (i < this.schema.length) {
            result = result.concat(this.schema[i].serialize(bytes, 4 + i * 2, messageStartPosition));
            i++;
        }
        return result;
    }

    debugSerialize(buffer, position, val0 = undefined) {
        return {
            name: this.name,
            bytes: this.serialize(buffer, position, val0),
        };
    }
}

// tslint:disable-next-line:max-classes-per-file
export class TableArrayAttribute extends Attribute {
    schema: any;
    name: any;
    /**
     * @constructor
     * @param {string} name
     * @param {module:schema/Schema} schema
     */
    constructor(name, schema) {
        super(name);
        this.schema = schema;
    }

    serialize(bytes, position, val0 = undefined) {
        let result = [];
        const arrayLength = findArrayLength(val0 ? val0 : bytes[0], position, bytes);
        let i = 0;
        while (i < arrayLength) {
            const startArrayPosition = findObjectArrayElementStartPosition(val0 ? val0 : bytes[0], position, bytes, i);
            for (let j = 0; j < this.schema.length; ++j) {
                result = result.concat(this.schema[j].serialize(bytes, 4 + j * 2, startArrayPosition));
            }
            i++;
        }
        return result;
    }

    debugSerialize(buffer, position, val0 = undefined) {
        return {
            name: this.name,
            bytes: this.serialize(buffer, position, val0),
        };
    }
}
