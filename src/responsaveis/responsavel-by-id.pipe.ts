import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ResponsaveisService } from './responsaveis.service';

@Injectable()
export class ResponsavelByIdPipe implements PipeTransform {
    constructor(private readonly responsaveisService: ResponsaveisService) { }

    async transform(value: string) {
        const id = parseInt(value, 10);
        if (isNaN(id)) {
            throw new BadRequestException('O ID passado na URL não é um número válido.');
        }

        const responsavel = await this.responsaveisService.findOne(id);
        if (!responsavel) {
            throw new NotFoundException(`Responsável com ID ${id} não encontrado.`);
        }

        return responsavel;
    }
}