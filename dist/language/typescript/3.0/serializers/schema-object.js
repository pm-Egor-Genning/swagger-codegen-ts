"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const Either_1 = require("fp-ts/lib/Either");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const types_1 = require("../../../../utils/types");
const function_1 = require("fp-ts/lib/function");
const array_1 = require("../../../../utils/array");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const ref_1 = require("../../../../utils/ref");
const schema_object_1 = require("../../../../schema/3.0/schema-object");
const reference_object_1 = require("../../../../schema/3.0/reference-object");
const either_1 = require("../../../../utils/either");
const isAllowedAdditionalProperties = (additionalProperties) => additionalProperties !== false;
exports.serializeSchemaObject = (from, name) => serializeSchemaObjectWithRecursion(from, true, name);
const serializeSchemaObjectWithRecursion = (from, shouldTrackRecursion, name) => (schemaObject) => {
    const isNullable = pipeable_1.pipe(schemaObject.nullable, fp_ts_1.option.exists(function_1.identity));
    if (schema_object_1.OneOfSchemaObjectCodec.is(schemaObject)) {
        return pipeable_1.pipe(serializeChildren(from, schemaObject.oneOf), fp_ts_1.either.map(serialized_type_1.getSerializedUnionType), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)), fp_ts_1.either.map(serialized_type_1.getSerializedNullableType(isNullable)));
    }
    if (schema_object_1.AllOfSchemaObjectCodec.is(schemaObject)) {
        return pipeable_1.pipe(serializeChildren(from, schemaObject.allOf), fp_ts_1.either.map(serialized_type_1.getSerializedIntersectionType), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)), fp_ts_1.either.map(serialized_type_1.getSerializedNullableType(isNullable)));
    }
    if (schema_object_1.EnumSchemaObjectCodec.is(schemaObject)) {
        return pipeable_1.pipe(serialized_type_1.getSerializedEnumType(schemaObject.enum), serialized_type_1.getSerializedNullableType(isNullable), Either_1.right);
    }
    switch (schemaObject.type) {
        case 'string':
        case 'boolean':
        case 'integer':
        case 'number': {
            return pipeable_1.pipe(serializePrimitive(from, schemaObject), fp_ts_1.either.map(serialized_type_1.getSerializedNullableType(isNullable)));
        }
        case 'array': {
            const { items } = schemaObject;
            const serialized = reference_object_1.ReferenceObjectCodec.is(items)
                ? pipeable_1.pipe(ref_1.fromString(items.$ref), Either_1.mapLeft(() => new Error(`Unable to serialize SchemaObject array items ref "${items.$ref}"`)), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
                : pipeable_1.pipe(items, serializeSchemaObjectWithRecursion(from, false, undefined));
            return pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized_type_1.getSerializedArrayType(schemaObject.minItems, name)), fp_ts_1.either.map(serialized_type_1.getSerializedNullableType(isNullable)));
        }
        case 'object': {
            const additionalProperties = pipeable_1.pipe(schemaObject.additionalProperties, fp_ts_1.option.filter(isAllowedAdditionalProperties), fp_ts_1.option.map(additionalProperties => {
                if (reference_object_1.ReferenceObjectCodec.is(additionalProperties)) {
                    return pipeable_1.pipe(additionalProperties.$ref, ref_1.fromString, Either_1.mapLeft(() => new Error(`Unable to serialize SchemaObject additionalProperties ref "${additionalProperties.$ref}"`)), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)));
                }
                else {
                    return additionalProperties !== true
                        ? pipeable_1.pipe(additionalProperties, serializeSchemaObjectWithRecursion(from, false, undefined))
                        : Either_1.right(serialized_type_1.SERIALIZED_UNKNOWN_TYPE);
                }
            }), fp_ts_1.option.map(fp_ts_1.either.map(serialized_type_1.getSerializedDictionaryType(name))), fp_ts_1.option.map(fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion))));
            const properties = pipeable_1.pipe(schemaObject.properties, fp_ts_1.option.map(properties => pipeable_1.pipe(types_1.serializeDictionary(properties, (name, property) => {
                const isRequired = pipeable_1.pipe(schemaObject.required, fp_ts_1.option.map(array_1.includes(name)), fp_ts_1.option.getOrElse(function_1.constFalse));
                if (reference_object_1.ReferenceObjectCodec.is(property)) {
                    return pipeable_1.pipe(property.$ref, ref_1.fromString, Either_1.mapLeft(() => new Error(`Unable to serialize SchemaObject property "${name}" ref "${property.$ref}"`)), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)), fp_ts_1.either.map(serialized_type_1.getSerializedOptionPropertyType(name, isRequired)));
                }
                else {
                    return pipeable_1.pipe(property, serializeSchemaObjectWithRecursion(from, false, undefined), fp_ts_1.either.map(serialized_type_1.getSerializedOptionPropertyType(name, isRequired)));
                }
            }), either_utils_1.sequenceEither, fp_ts_1.either.map(s => serialized_type_1.intercalateSerializedTypes(serialized_type_1.serializedType(';', ',', [], []), s)), fp_ts_1.either.map(serialized_type_1.getSerializedObjectType(name)), fp_ts_1.either.map(serialized_type_1.getSerializedRecursiveType(from, shouldTrackRecursion)))));
            return pipeable_1.pipe(additionalProperties, fp_ts_1.option.alt(() => properties), fp_ts_1.option.map(fp_ts_1.either.map(serialized_type_1.getSerializedNullableType(isNullable))), fp_ts_1.option.getOrElse(() => Either_1.right(serialized_type_1.SERIALIZED_UNKNOWN_TYPE)));
        }
    }
};
const serializeChildren = (from, children) => either_1.traverseNEAEither(children, item => reference_object_1.ReferenceObjectCodec.is(item)
    ? pipeable_1.pipe(ref_1.fromString(item.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
    : serializeSchemaObjectWithRecursion(from, false)(item));
const serializePrimitive = (from, schemaObject) => {
    switch (schemaObject.type) {
        case 'string': {
            return serialized_type_1.getSerializedStringType(from, schemaObject.format);
        }
        case 'number': {
            return Either_1.right(serialized_type_1.SERIALIZED_NUMBER_TYPE);
        }
        case 'integer': {
            return Either_1.right(serialized_type_1.SERIALIZED_INTEGER_TYPE);
        }
        case 'boolean': {
            return Either_1.right(serialized_type_1.SERIALIZED_BOOLEAN_TYPE);
        }
    }
};
