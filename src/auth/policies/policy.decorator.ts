import { SetMetadata } from '@nestjs/common';
import { Action, Resource } from '../ability/ability.factory';

export interface PolicyRule {
  action: Action;
  resource: Resource;
}

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...requirements: PolicyRule[]) =>
  SetMetadata(CHECK_POLICIES_KEY, requirements);
