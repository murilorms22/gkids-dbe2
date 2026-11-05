import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(email: string, senhaDigitada: string) {
        // verificaçao de email
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // comparaçao da senha
        const senhaValida = await bcrypt.compare(senhaDigitada, user.senha);
        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // gera o token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        // salva no banco de dados
        await this.prisma.token.create({
            data: {
                token: token,
                userId: user.id,
            },
        });

        return { access_token: token };
    }

    // deleta/revoga o token
    async logout(tokenStr: string) {
        await this.prisma.token.deleteMany({
            where: { token: tokenStr },
        });
        return { message: 'Logout realizado com sucesso' };
    }

    // deleta/revoga todos tokens relacionados ao usuario
    async revogarTodos(userId: number) {
        await this.prisma.token.deleteMany({
            where: { userId },
        });
        return { message: 'Todos os tokens revogados' };
    }
}