"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const pipeable_1 = require("fp-ts/lib/pipeable");
const definitions_object_1 = require("./definitions-object");
const paths_object_1 = require("./paths-object");
const utils_1 = require("../../common/utils");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const ref_1 = require("../../../../utils/ref");
const client_1 = require("../../common/bundled/client");
const parameters_definitions_object_1 = require("./parameters-definitions-object");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const responses_definitions_object_1 = require("./responses-definitions-object");
const utils_2 = require("../../common/bundled/utils");
const definitionsRef = ref_1.fromString('#/definitions');
const parametersRef = ref_1.fromString('#/parameters');
const responsesRef = ref_1.fromString('#/responses');
exports.serializeSwaggerObject = reader_utils_1.combineReader(paths_object_1.serializePaths, serializePaths => (name, swaggerObject) => {
    const definitions = pipeable_1.pipe(swaggerObject.definitions, fp_ts_1.option.map(definitions => pipeable_1.pipe(definitionsRef, fp_ts_1.either.chain(from => definitions_object_1.serializeDefinitions(from, definitions)))));
    const parameters = pipeable_1.pipe(swaggerObject.parameters, fp_ts_1.option.map(parameters => pipeable_1.pipe(parametersRef, fp_ts_1.either.chain(ref => parameters_definitions_object_1.serializeParametersDefinitionsObject(ref, parameters)))));
    const responses = pipeable_1.pipe(swaggerObject.responses, fp_ts_1.option.map(responses => pipeable_1.pipe(responsesRef, fp_ts_1.either.chain(ref => responses_definitions_object_1.serializeResponsesDefinitionsObject(ref, responses)))));
    const additional = pipeable_1.pipe([definitions, parameters, responses], fp_ts_1.array.compact, either_utils_1.sequenceEither);
    const paths = pipeable_1.pipe(utils_1.pathsRef, fp_ts_1.either.chain(from => serializePaths(from, swaggerObject.paths)));
    return either_utils_1.combineEither(additional, paths, client_1.clientFile, utils_2.utilsFile, (additional, paths, clientFile, utilsFile) => fs_1.directory(name, [clientFile, ...additional, utilsFile, paths]));
});
