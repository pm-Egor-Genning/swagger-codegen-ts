import { FSEntity } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { Dictionary } from '../../../utils/types';
import { OpenapiObject } from '../../../schema/3.0/openapi-object';
import { SerializeOptions } from '../common/utils';
export { serializeDocument } from './serializers/document';
export declare const serialize: import("fp-ts/lib/Reader").Reader<import("../../../utils/ref").ResolveRefContext, (documents: Dictionary<OpenapiObject>, options?: SerializeOptions) => Either<Error, FSEntity>>;
