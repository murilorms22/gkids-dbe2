import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TurmasModule } from './turmas/turmas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponsaveisModule } from './responsaveis/responsaveis.module';
import { AlunosModule } from './alunos/alunos.module';

@Module({
  imports: [PrismaModule, TurmasModule, ResponsaveisModule, AlunosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
