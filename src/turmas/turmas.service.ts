import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Injectable()
export class TurmasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTurmaDto: CreateTurmaDto) {
    return this.prisma.turma.create({
      data: createTurmaDto,
    });
  }

  async findAll() {
    return this.prisma.turma.findMany();
  }

  async findOne(id: number) {
    const turma = await this.prisma.turma.findUnique({
      where: { id },
    });

    if (!turma) {
      throw new NotFoundException(`Turma com ID #${id} não encontrada.`);
    }

    return turma;
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

    return this.prisma.turma.delete({
      where: { id },
    });
  }
}
