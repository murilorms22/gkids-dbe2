import { Controller, Get, Post, Body, Patch, Put, Param, Delete, ParseIntPipe, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    // usuario comum so pode criar usuario do tipo comum/responsavel
    if (req.user.role !== 'ADMIN') {
      createUserDto.role = 'RESPONSAVEL';
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Req() req: any) {
    // apenas admin pode ver a lista completa de usuarios
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso negado: apenas o admin pode visualizar todos os usuários.');
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    // usuario autenticado so pode ver suas proprias informacoes
    if (req.user.role !== 'ADMIN' && req.user.sub !== id) {
      throw new ForbiddenException('Acesso negado: você só pode visualizar o seu próprio perfil.');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    // usuario autenticado so pode editar suas proprias informacoes
    if (req.user.role !== 'ADMIN' && req.user.sub !== id) {
      throw new ForbiddenException('Acesso negado: você só pode editar o seu próprio perfil.');
    }
    if (req.user.role !== 'ADMIN') {
      delete updateUserDto.role; // usuario comum nao pode alterar sua propria role
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id')
  updatePut(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.update(id, updateUserDto, req);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    // usuario autenticado so pode excluir o seu proprio perfil
    if (req.user.role !== 'ADMIN' && req.user.sub !== id) {
      throw new ForbiddenException('Acesso negado: você só pode excluir o seu próprio perfil.');
    }
    return this.usersService.remove(id);
  }
}

