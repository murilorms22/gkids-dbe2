import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { ResponsaveisService } from './responsaveis.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { ResponsavelByIdPipe } from './responsavel-by-id.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('responsaveis')
export class ResponsaveisController {
  constructor(private readonly responsaveisService: ResponsaveisService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createResponsavelDto: CreateResponsavelDto) {
    return this.responsaveisService.create(createResponsavelDto);
  }

  @Get()
  findAll() {
    return this.responsaveisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ResponsavelByIdPipe) responsavel: any) {
    return responsavel;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ResponsavelByIdPipe) responsavel: any, 
    @Body() updateResponsavelDto: UpdateResponsavelDto,
    @Req() req: any
  ) {
    // req.user.sub eh o id de quem logou; responsavel.id eh o id que tá sendo alterado
    if (req.user.sub !== responsavel.id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso negado: você só pode editar o seu próprio perfil.');
    }
    
    return this.responsaveisService.update(responsavel.id, updateResponsavelDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ResponsavelByIdPipe) responsavel: any) {
    return this.responsaveisService.remove(responsavel.id);
  }
}