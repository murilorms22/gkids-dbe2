import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmaByIdPipe } from './turma-by-id.pipe';

@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) { }

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

  @Patch(':id')
  update(@Param('id', TurmaByIdPipe) turma: any, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(turma.id, updateTurmaDto);
  }

  @Delete(':id')
  remove(@Param('id', TurmaByIdPipe) turma: any) {
    return this.turmasService.remove(turma.id);
  }
}
