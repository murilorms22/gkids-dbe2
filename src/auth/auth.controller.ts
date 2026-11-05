import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() body: any) {
        return this.authService.login(body.email, body.senha);
    }

    @Post('logout')
    logout(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Token não fornecido');
        }
        // trata a req do postman e pega so o token 'bearer token.123'
        const token = authHeader.split(' ')[1];
        return this.authService.logout(token);
    }
}