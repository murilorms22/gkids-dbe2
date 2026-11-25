import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Injectable()
export class ResponsaveisService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createResponsavelDto: CreateResponsavelDto) {
    try {
      return await this.prisma.responsavel.create({
        data: createResponsavelDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Já existe um responsável cadastrado com este CPF.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.responsavel.findMany();
  }

  async findOne(id: number, incluirAlunos: boolean = false) {
    const responsavel = await this.prisma.responsavel.findUnique({
      where: { id },
      include: incluirAlunos ? { alunos: true } : undefined,
    });
    if (!responsavel) throw new NotFoundException(`Responsável #${id} não encontrado.`);
    return responsavel;
  }

  async findAlunos(id: number) {
    const alunos = await this.prisma.responsavel.findUnique({ where: { id } }).alunos();
    if (alunos === null) {
      throw new NotFoundException(`Responsável #${id} não encontrado.`);
    }
    return alunos;
  }

  async update(id: number, updateResponsavelDto: UpdateResponsavelDto) {
    await this.findOne(id);
    try {
      return await this.prisma.responsavel.update({
        where: { id },
        data: updateResponsavelDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Já existe um responsável cadastrado com este CPF.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.responsavel.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          'Não é possível remover este responsável pois existem alunos vinculados a ele.',
        );
      }
      throw error;
    }
  }
}
