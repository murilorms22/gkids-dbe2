import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { AbilityFactory } from './ability/ability.factory';
import { PoliciesGuard } from './policies/policies.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'chave_secreta_gerenciakids_2026',
      signOptions: { expiresIn: '1d' }, // token expira em 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthGuard, RolesGuard, AbilityFactory, PoliciesGuard],
  exports: [AuthService, AuthGuard, RolesGuard, AbilityFactory, PoliciesGuard],
})
export class AuthModule { }