import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { FilterAlunoDto } from './dto/filter-aluno.dto';
import { AlunoByIdPipe } from './aluno-by-id.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunosService.create(createAlunoDto);
  }

  @Get()
  findAll(@Query() filters?: FilterAlunoDto) {
    return this.alunosService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', AlunoByIdPipe) aluno: any) {
    return aluno;
  }

  @Get(':id/turma')
  findTurma(@Param('id', ParseIntPipe) id: number) {
    return this.alunosService.findTurma(id);
  }

  @Get(':id/responsavel')
  findResponsavel(@Param('id', ParseIntPipe) id: number) {
    return this.alunosService.findResponsavel(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', AlunoByIdPipe) aluno: any, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunosService.update(aluno.id, updateAlunoDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  updatePut(@Param('id', AlunoByIdPipe) aluno: any, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunosService.update(aluno.id, updateAlunoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', AlunoByIdPipe) aluno: any) {
    return this.alunosService.remove(aluno.id);
  }
}
