// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from './response.interface';

export class ResponseError implements IResponse {
  constructor(infoMessage: string, status: any, data?: any) {
    this.success = false;
    this.message = infoMessage;
    this.data = data;
    this.status = status;
    console.warn(
      new Date().toString() +
        ' - [Response]: ' +
        infoMessage +
        (data ? ' - ' + JSON.stringify(data) : ''),
    );
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
  status: any;
}

export class ResponseSuccess implements IResponse {
  constructor(infoMessage: string, status: any, data?: any) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
    this.status = status;
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
  status: any;
}
