import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // verifica se email ja esta cadastrado
    const existente = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existente) {
      throw new ConflictException('Email já cadastrado');
    }

    // criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(createUserDto.senha, 10);

    const user = await this.prisma.user.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: senhaHash,
        role: (createUserDto.role as any) || 'USER',
      },
    });

    const { senha, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const data: any = {};
    if (updateUserDto.nome) data.nome = updateUserDto.nome;
    if (updateUserDto.email) data.email = updateUserDto.email;
    if (updateUserDto.senha) {
      data.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }
    if (updateUserDto.role) {
      data.role = updateUserDto.role;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso' };
  }
}

