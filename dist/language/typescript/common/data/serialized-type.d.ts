import { SerializedDependency } from './serialized-dependency';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Ref } from '../../../../utils/ref';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { JSONPrimitive } from '../../../../utils/io-ts';
import { option } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
export interface SerializedType {
    readonly type: string;
    readonly io: string;
    readonly dependencies: SerializedDependency[];
    readonly refs: Ref[];
}
export declare const serializedType: (type: string, io: string, dependencies: SerializedDependency[], refs: Ref<string>[]) => SerializedType;
export declare const monoidSerializedType: Monoid<SerializedType>;
export declare const foldSerializedTypes: (as: SerializedType[]) => SerializedType;
export declare const intercalateSerializedTypes: (sep: SerializedType, fm: SerializedType[]) => SerializedType;
export declare const uniqSerializedTypesByTypeAndIO: (as: SerializedType[]) => SerializedType[];
export declare const SERIALIZED_VOID_TYPE: SerializedType;
export declare const SERIALIZED_UNKNOWN_TYPE: SerializedType;
export declare const getSerializedBlobType: (from: Ref<string>) => Either<Error, SerializedType>;
export declare const SERIALIZED_BOOLEAN_TYPE: SerializedType;
export declare const SERIALIZED_NUMBER_TYPE: SerializedType;
export declare const SERIALIZED_INTEGER_TYPE: SerializedType;
export declare const SERIALIZED_DATETIME_TYPE: SerializedType;
export declare const SERIALIZED_DATE_TYPE: SerializedType;
export declare const SERIALIZED_STRING_TYPE: SerializedType;
export declare const getSerializedStringType: (from: Ref<string>, format: option.Option<string>) => Either<Error, SerializedType>;
export declare const SERIALIZED_NULL_TYPE: SerializedType;
export declare const getSerializedNullableType: (isNullable: boolean) => (type: SerializedType) => SerializedType;
export declare const getSerializedArrayType: (minItems: option.Option<number>, name?: string | undefined) => (serialized: SerializedType) => SerializedType;
export declare const getSerializedRefType: (from: Ref<string>) => (to: Ref<string>) => SerializedType;
export declare const getSerializedObjectType: (name?: string | undefined) => (serialized: SerializedType) => SerializedType;
export declare const getSerializedDictionaryType: (name?: string | undefined) => (serialized: SerializedType) => SerializedType;
export declare const getSerializedRecursiveType: (from: Ref<string>, shouldTrackRecursion: boolean) => (serialized: SerializedType) => SerializedType;
export declare const getSerializedUnionType: (serialized: NonEmptyArray<SerializedType>) => SerializedType;
export declare const getSerializedIntersectionType: (serialized: NonEmptyArray<SerializedType>) => SerializedType;
export declare const getSerializedEnumType: (value: NonEmptyArray<JSONPrimitive>) => SerializedType;
export declare const getSerializedPrimitiveType: (value: JSONPrimitive) => SerializedType;
export declare const getSerializedOptionType: (serialized: SerializedType) => SerializedType;
export declare const getSerializedOptionalType: (isRequired: boolean, serialized: SerializedType) => SerializedType;
export declare const getSerializedPropertyType: (name: string, isRequired: boolean, serialized: SerializedType) => SerializedType;
export declare const getSerializedOptionPropertyType: (name: string, isRequired: boolean) => (serialized: SerializedType) => SerializedType;
