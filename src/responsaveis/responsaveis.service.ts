import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Injectable()
export class ResponsaveisService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResponsavelDto: CreateResponsavelDto) {
    return this.prisma.responsavel.create({
      data: createResponsavelDto,
    });
  }

  async findAll() {
    return this.prisma.responsavel.findMany();
  }

  async findOne(id: number) {
    const responsavel = await this.prisma.responsavel.findUnique({
      where: { id },
    });
    if (!responsavel) throw new NotFoundException(`Responsável #${id} não encontrado.`);
    return responsavel;
  }

  async update(id: number, updateResponsavelDto: UpdateResponsavelDto) {
    await this.findOne(id);
    return this.prisma.responsavel.update({
      where: { id },
      data: updateResponsavelDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.responsavel.delete({
      where: { id },
    });
  }
}
