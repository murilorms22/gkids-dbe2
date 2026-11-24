import { Injectable } from '@nestjs/common';

export enum Action {
  MANAGE = 'manage', // acesso irrestrito
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Resource = 'all' | 'Turma' | 'Aluno' | 'Responsavel' | 'User';

export interface Rule {
  action: Action;
  resource: Resource;
}

export class AppAbility {
  constructor(private rules: Rule[]) { }

  can(action: Action, resource: Resource): boolean {
    return this.rules.some(
      (rule) =>
        (rule.action === Action.MANAGE || rule.action === action) &&
        (rule.resource === 'all' || rule.resource === resource),
    );
  }
}

@Injectable()
export class AbilityFactory {
  // define as habilidades com base no papel do usuario
  createForUser(user: { id: number; role: string }): AppAbility {
    const rules: Rule[] = [];

    // admin tem acesso irrestrito a todos os recursos
    if (user?.role === 'ADMIN') {
      rules.push({ action: Action.MANAGE, resource: 'all' });
      return new AppAbility(rules);
    }

    // gerente tem acesso irrestrito ao recurso turma
    if (user?.role === 'DIRECAO' || user?.role === 'GERENTE') {
      rules.push({ action: Action.MANAGE, resource: 'Turma' });
      rules.push({ action: Action.READ, resource: 'Aluno' });
      rules.push({ action: Action.READ, resource: 'Responsavel' });
      return new AppAbility(rules);
    }

    // usuario comum tem apenas permissoes basicas
    rules.push({ action: Action.READ, resource: 'Turma' });
    rules.push({ action: Action.READ, resource: 'Aluno' });
    rules.push({ action: Action.READ, resource: 'Responsavel' });

    return new AppAbility(rules);
  }
}

