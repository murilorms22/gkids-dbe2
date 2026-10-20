import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TurmasService } from './turmas.service';

@Injectable()
export class TurmaByIdPipe implements PipeTransform {
    constructor(private readonly turmasService: TurmasService) { }

    async transform(value: string) {
        const id = parseInt(value, 10);
        if (isNaN(id)) {
            throw new BadRequestException('O ID passado na URL não é um número válido.');
        }

        const turma = await this.turmasService.findOne(id);
        if (!turma) {
            throw new NotFoundException(`Turma com ID ${id} não encontrada.`);
        }

        return turma;
    }
}