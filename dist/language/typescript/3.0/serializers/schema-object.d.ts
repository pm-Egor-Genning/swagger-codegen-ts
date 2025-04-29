import { SerializedType } from '../../common/data/serialized-type';
import { Either } from 'fp-ts/lib/Either';
import { Ref } from '../../../../utils/ref';
import { SchemaObject } from '../../../../schema/3.0/schema-object';
export declare const serializeSchemaObject: (from: Ref<string>, name?: string | undefined) => (schemaObject: SchemaObject) => Either<Error, SerializedType>;
