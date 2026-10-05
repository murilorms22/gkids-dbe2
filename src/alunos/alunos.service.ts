import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAlunoDto: CreateAlunoDto) {
    return this.prisma.aluno.create({
      data: {
        nome: createAlunoDto.nome,
        data_nascimento: new Date(createAlunoDto.data_nascimento),
        turmaId: createAlunoDto.turmaId,
        responsavelId: createAlunoDto.responsavelId,
      },
    });
  }

  async findAll() {
    return this.prisma.aluno.findMany({
      include: {
        turma: true,
        responsavel: true,
      },
    });
  }

  async findOne(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        turma: true,
        responsavel: true,
      },
    });
    if (!aluno) throw new NotFoundException(`Aluno #${id} não encontrado.`);
    return aluno;
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    await this.findOne(id);

    const dataToUpdate: any = { ...updateAlunoDto };
    if (updateAlunoDto.data_nascimento) {
      dataToUpdate.data_nascimento = new Date(updateAlunoDto.data_nascimento);
    }

    return this.prisma.aluno.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.aluno.delete({
      where: { id },
    });
  }
}
