import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmaByIdPipe } from './turma-by-id.pipe';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) { }

  @Roles('DIRECAO')
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmasService.create(createTurmaDto);
  }

  @Get()
  findAll() {
    return this.turmasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', TurmaByIdPipe) turma: any) {
    return turma;
  }

  @Roles('DIRECAO')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', TurmaByIdPipe) turma: any, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(turma.id, updateTurmaDto);
  }

  @Roles('DIRECAO')
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', TurmaByIdPipe) turma: any) {
    return this.turmasService.remove(turma.id);
  }
}
