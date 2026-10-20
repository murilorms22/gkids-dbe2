import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ResponsaveisService } from './responsaveis.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { ResponsavelByIdPipe } from './responsavel-by-id.pipe';

@Controller('responsaveis')
export class ResponsaveisController {
  constructor(private readonly responsaveisService: ResponsaveisService) { }

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

  @Patch(':id')
  update(@Param('id', ResponsavelByIdPipe) responsavel: any, @Body() updateResponsavelDto: UpdateResponsavelDto) {
    return this.responsaveisService.update(responsavel.id, updateResponsavelDto);
  }

  @Delete(':id')
  remove(@Param('id', ResponsavelByIdPipe) responsavel: any) {
    return this.responsaveisService.remove(responsavel.id);
  }
}
