import { SerializedResponse } from './response-object';
import { either } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
import { ResponsesObject } from '../../../../schema/3.0/responses-object';
export declare const serializeResponsesObject: (from: Ref<string>) => (responsesObject: ResponsesObject) => either.Either<Error, either.Either<SerializedResponse, SerializedResponse[]>>;
