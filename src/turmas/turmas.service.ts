import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { FilterTurmaDto } from './dto/filter-turma.dto';

@Injectable()
export class TurmasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTurmaDto: CreateTurmaDto) {
    return this.prisma.turma.create({
      data: createTurmaDto,
    });
  }

  async findAll(filters?: FilterTurmaDto) {
    const where: Prisma.TurmaWhereInput = {};

    if (filters?.nome?.trim()) {
      where.nome = { contains: filters.nome.trim() };
    }
    if (filters?.turno?.trim()) {
      where.turno = { contains: filters.turno.trim() };
    }
    if (filters?.ano_letivo?.trim()) {
      where.ano_letivo = { contains: filters.ano_letivo.trim() };
    }

    return this.prisma.turma.findMany({
      where,
      include: {
        _count: {
          select: { alunos: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number, incluirAlunos: boolean = false) {
    const turma = await this.prisma.turma.findUnique({
      where: { id },
      include: incluirAlunos ? { alunos: true } : undefined,
    });

    if (!turma) {
      throw new NotFoundException(`Turma com ID #${id} não encontrada.`);
    }

    return turma;
  }

  async findAlunos(id: number) {
    const alunos = await this.prisma.turma.findUnique({ where: { id } }).alunos();

    if (alunos === null) {
      throw new NotFoundException(`Turma com ID #${id} não encontrada.`);
    }

    return alunos;
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    await this.findOne(id);

    return this.prisma.turma.update({
      where: { id },
      data: updateTurmaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.turma.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          'Não é possível remover esta turma pois existem alunos vinculados a ela.',
        );
      }
      throw error;
    }
  }
}
