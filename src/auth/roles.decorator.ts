import { SetMetadata } from '@nestjs/common';

// cria as roles personalizadas
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);