import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // pega a role exigida pela pagina
    const papeisExigidos = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!papeisExigidos) {
      return true; // se a rota nao exige role, deixa passar
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // usuario da req

    // role admin tem acesso direto
    if (user?.role === 'ADMIN') {
      return true; 
    }

    // verifica se a role do usuario bate com a exigencia da pagina
    const temPermissao = papeisExigidos.includes(user?.role);
    
    if (!temPermissao) {
      throw new ForbiddenException('Acesso negado: seu nível de permissão é insuficiente.');
    }

    return true;
  }
}