import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability/ability.factory';
import { CHECK_POLICIES_KEY, PolicyRule } from './policy.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<PolicyRule[]>(CHECK_POLICIES_KEY, context.getHandler());

    if (!rules || rules.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Acesso negado: usuário não autenticado.');
    }

    const ability = this.abilityFactory.createForUser(user);

    const permits = rules.every((rule) => ability.can(rule.action, rule.resource));

    if (!permits) {
      throw new ForbiddenException('Acesso negado: seu papel não tem permissão para este recurso.');
    }

    return true;
  }
}

