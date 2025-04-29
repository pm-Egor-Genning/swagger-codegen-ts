import { either } from 'fp-ts';
import { SerializedType } from '../../common/data/serialized-type';
import { Ref } from '../../../../utils/ref';
import { PathItemObject } from '../../../../schema/3.0/path-item-object';
export declare const serializeResponseMaps: (pattern: string, item: PathItemObject, from: Ref<string>) => either.Either<Error, SerializedType>;
