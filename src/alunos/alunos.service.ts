import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { FilterAlunoDto } from './dto/filter-aluno.dto';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAlunoDto: CreateAlunoDto) {
    try {
      return await this.prisma.aluno.create({
        data: {
          nome: createAlunoDto.nome,
          data_nascimento: new Date(createAlunoDto.data_nascimento),
          turmaId: createAlunoDto.turmaId,
          responsavelId: createAlunoDto.responsavelId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException(
          'Chave estrangeira inválida: verifique se a turma (turmaId) e o responsável (responsavelId) informados existem.',
        );
      }
      throw error;
    }
  }

  async findAll(filters?: FilterAlunoDto) {
    const where: Prisma.AlunoWhereInput = {};

    if (filters?.nome?.trim()) {
      where.nome = { contains: filters.nome.trim() };
    }
    if (filters?.turmaId !== undefined) {
      where.turmaId = filters.turmaId;
    }
    if (filters?.responsavelId !== undefined) {
      where.responsavelId = filters.responsavelId;
    }

    return this.prisma.aluno.findMany({
      where,
      include: {
        turma: true,
        responsavel: true,
      },
      orderBy: { id: 'asc' },
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

  async findTurma(id: number) {
    const turma = await this.prisma.aluno.findUnique({ where: { id } }).turma();
    if (turma === null) {
      throw new NotFoundException(`Aluno #${id} não encontrado.`);
    }
    return turma;
  }

  async findResponsavel(id: number) {
    const responsavel = await this.prisma.aluno.findUnique({ where: { id } }).responsavel();
    if (responsavel === null) {
      throw new NotFoundException(`Aluno #${id} não encontrado.`);
    }
    return responsavel;
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    await this.findOne(id);

    const dataToUpdate: any = { ...updateAlunoDto };
    if (updateAlunoDto.data_nascimento) {
      dataToUpdate.data_nascimento = new Date(updateAlunoDto.data_nascimento);
    }

    try {
      return await this.prisma.aluno.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException(
          'Chave estrangeira inválida: verifique se a turma (turmaId) e o responsável (responsavelId) informados existem.',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.aluno.delete({
      where: { id },
    });
  }
}
