import { HttpStatus } from '@nestjs/common';

export const responseStatus = {
  success: HttpStatus.OK,
  fail: HttpStatus,
};

export enum AppErrorCode {
  ERROR = 'ERROR',
  Duplicate = 'DUPLICATE_VALUES',
  Existing = 'EXISTING_VALUES',
  NOT_EXISTING = 'NOT_EXISTING',
}

export class AppResponse {
  static OkSuccess(obj: object, message = '', status: number) {
    const res = {
      data: obj,
      message: message,
      status,
    };
    return res;
  }
  static OkFailure(message = '', code: number, status: number) {
    const res = {
      code: code,
      message: message,
      status,
    };
    return res;
  }
  static NotFound(message = 'resource(s) not found') {
    const res = {
      message: message,
      status: responseStatus.fail,
    };
    return res;
  }

  static badRequest(
    errors,
    message = '',
    code: AppErrorCode = AppErrorCode.ERROR,
  ) {
    return {
      status: HttpStatus.BAD_REQUEST,
      error: errors,
      message: message,
      code: code,
    };
  }
}
