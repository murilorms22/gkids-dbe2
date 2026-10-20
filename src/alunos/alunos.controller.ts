import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { AlunoByIdPipe } from './aluno-by-id.pipe';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) { }

  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunosService.create(createAlunoDto);
  }

  @Get()
  findAll() {
    return this.alunosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', AlunoByIdPipe) aluno: any) {
    return aluno;
  }

  @Patch(':id')
  update(@Param('id', AlunoByIdPipe) aluno: any, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunosService.update(aluno.id, updateAlunoDto);
  }

  @Delete(':id')
  remove(@Param('id', AlunoByIdPipe) aluno: any) {
    return this.alunosService.remove(aluno.id);
  }
}