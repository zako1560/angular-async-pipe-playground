import {Type, ɵRuntimeError as RuntimeError, ɵstringify as stringify} from '@angular/core';

import {RuntimeErrorCode} from './errors';

export function invalidPipeArgumentError(type: Type<any>, value: Object) {
  return new RuntimeError(
    RuntimeErrorCode.INVALID_PIPE_ARGUMENT,
    `InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}