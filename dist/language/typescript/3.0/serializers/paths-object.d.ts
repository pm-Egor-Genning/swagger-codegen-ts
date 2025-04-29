import { Directory } from '../../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { Ref } from '../../../../utils/ref';
import { PathsObject } from '../../../../schema/3.0/paths-object';
export declare const serializePathsObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (from: Ref<string>) => (pathsObject: PathsObject) => Either<Error, Directory>>;
