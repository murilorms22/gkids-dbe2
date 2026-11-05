import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { AlunoByIdPipe } from './aluno-by-id.pipe';
import { UseGuards } from '@nestjs/common';
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
  findAll() {
    return this.alunosService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id', AlunoByIdPipe) aluno: any) {
    return aluno;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', AlunoByIdPipe) aluno: any, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunosService.update(aluno.id, updateAlunoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', AlunoByIdPipe) aluno: any) {
    return this.alunosService.remove(aluno.id);
  }
}