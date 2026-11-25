import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { FilterTurmaDto } from './dto/filter-turma.dto';
import { TurmaByIdPipe } from './turma-by-id.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PoliciesGuard } from '../auth/policies/policies.guard';
import { CheckPolicies } from '../auth/policies/policy.decorator';
import { Action } from '../auth/ability/ability.factory';

@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) { }

  @Roles('DIRECAO', 'GERENTE')
  @CheckPolicies({ action: Action.CREATE, resource: 'Turma' })
  @UseGuards(AuthGuard, RolesGuard, PoliciesGuard)
  @Post()
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmasService.create(createTurmaDto);
  }

  @Get()
  findAll(@Query() filters?: FilterTurmaDto) {
    return this.turmasService.findAll(filters);
  }

  @Get(':id')
  findOne(
    @Param('id', TurmaByIdPipe) turma: any,
    @Query('incluirAlunos') incluirAlunos?: string,
  ) {
    if (incluirAlunos === 'true') {
      return this.turmasService.findOne(turma.id, true);
    }
    return turma;
  }

  @Get(':id/alunos')
  findAlunos(@Param('id', ParseIntPipe) id: number) {
    return this.turmasService.findAlunos(id);
  }

  @Roles('DIRECAO', 'GERENTE')
  @CheckPolicies({ action: Action.UPDATE, resource: 'Turma' })
  @UseGuards(AuthGuard, RolesGuard, PoliciesGuard)
  @Patch(':id')
  update(@Param('id', TurmaByIdPipe) turma: any, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(turma.id, updateTurmaDto);
  }

  @Roles('DIRECAO', 'GERENTE')
  @CheckPolicies({ action: Action.UPDATE, resource: 'Turma' })
  @UseGuards(AuthGuard, RolesGuard, PoliciesGuard)
  @Put(':id')
  updatePut(@Param('id', TurmaByIdPipe) turma: any, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(turma.id, updateTurmaDto);
  }

  @Roles('DIRECAO', 'GERENTE')
  @CheckPolicies({ action: Action.DELETE, resource: 'Turma' })
  @UseGuards(AuthGuard, RolesGuard, PoliciesGuard)
  @Delete(':id')
  remove(@Param('id', TurmaByIdPipe) turma: any) {
    return this.turmasService.remove(turma.id);
  }
}
