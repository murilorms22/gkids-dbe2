import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1]; // trata a response do token
    
    try {
      // verifica se o token eh valido
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'chave_secreta_gerenciakids_2026',
      });

      // ve se o token existe no banco
      const tokenAtivo = await this.prisma.token.findUnique({ where: { token } });
      if (!tokenAtivo) {
        throw new UnauthorizedException('Token revogado. Faça login novamente.');
      }

      // guarda as informaçoes do usuario na req para usar depois
      request['user'] = payload;
      
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    
    return true;
  }
}