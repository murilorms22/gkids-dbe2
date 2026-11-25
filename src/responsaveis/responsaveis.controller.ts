import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseIntPipe, Req, ForbiddenException, UseGuards } from '@nestjs/common';
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
  findOne(
    @Param('id', ResponsavelByIdPipe) responsavel: any,
    @Query('incluirAlunos') incluirAlunos?: string,
  ) {
    if (incluirAlunos === 'true') {
      return this.responsaveisService.findOne(responsavel.id, true);
    }
    return responsavel;
  }

  @Get(':id/alunos')
  findAlunos(@Param('id', ParseIntPipe) id: number) {
    return this.responsaveisService.findAlunos(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ResponsavelByIdPipe) responsavel: any, 
    @Body() updateResponsavelDto: UpdateResponsavelDto,
  ) {
    return this.responsaveisService.update(responsavel.id, updateResponsavelDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  updatePut(
    @Param('id', ResponsavelByIdPipe) responsavel: any, 
    @Body() updateResponsavelDto: UpdateResponsavelDto,
  ) {
    return this.responsaveisService.update(responsavel.id, updateResponsavelDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ResponsavelByIdPipe) responsavel: any) {
    return this.responsaveisService.remove(responsavel.id);
  }
}
