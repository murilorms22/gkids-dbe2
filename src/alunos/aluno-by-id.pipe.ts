import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AlunosService } from './alunos.service';

@Injectable()
export class AlunoByIdPipe implements PipeTransform {
    constructor(private readonly alunosService: AlunosService) { }

    async transform(value: string) {
        const id = parseInt(value, 10);

        if (isNaN(id)) {
            throw new BadRequestException('O ID passado na URL não é um número válido.');
        }

        const aluno = await this.alunosService.findOne(id);

        if (!aluno) {
            throw new NotFoundException(`Aluno com ID ${id} não encontrado.`);
        }

        return aluno;
    }
}