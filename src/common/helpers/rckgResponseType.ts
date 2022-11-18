export declare class BaseResponseType {
  status: number;
  success?: boolean;
  message: string;
}
export declare class Ok<Type> extends BaseResponseType {
  data?: Type;
}
export declare class BadRequest extends BaseResponseType {
  error?: unknown;
  errorCode?: string;
}
export declare class NotFound extends BaseResponseType {
  error?: unknown;
  errorCode?: string;
}
