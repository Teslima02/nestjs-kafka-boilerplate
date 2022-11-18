import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * retrieve the current user with a decorator
 * example of a controller method:
 * @Post()
 * someMethod(@CurrentUser() user: User) {
 *   // do something with the user
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
