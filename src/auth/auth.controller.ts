import { Controller, Post, Body, Req, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.senha);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(
        @Req() req: any,
        @Query('all') all?: string,
        @Body('all') bodyAll?: boolean,
    ) {
        // se all for true revoga todos os tokens do usuario, senao revoga so o enviado
        const revokeAll = all === 'true' || bodyAll === true;
        return this.authService.logout(req.token, revokeAll);
    }

    @UseGuards(AuthGuard)
    @Post('logout-all')
    logoutAll(@Req() req: any) {
        return this.authService.revogarTodos(req.user.sub);
    }
}