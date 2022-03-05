// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
// import { CHECK_POLICIES_KEY } from '../constants/default.constants';
// import { PolicyHandler } from '../interfaces/policyhandler.interface';

// @Injectable()
// export class PolicyGuards implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private caslAblitiy: CaslAbilityFactory,
//   ) {}

//   async canActivate(executor: ExecutionContext): Promise<boolean> {
//     const policyHnadlers = this.reflector.get<PolicyHandler[]>(
//       CHECK_POLICIES_KEY,
//       executor.getHandler(),
//     );
//     const { user } = executor.switchToHttp().getRequest();
//     const ability = await this.caslAblitiy.createForUser(user);

//     return policyHnadlers.every((handler) =>
//       this.execPolicyHandler(handler, ability),
//     );
//   }

//   execPolicyHandler(handler: PolicyHandler, ability) {
//     if (typeof handler === 'function') {
//       return handler(ability);
//     }
//     return handler.handle(ability);
//   }
// }
