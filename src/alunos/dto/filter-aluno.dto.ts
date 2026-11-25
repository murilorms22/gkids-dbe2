import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterAlunoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === undefined ? undefined : Number(value),
  )
  @IsInt({ message: 'turmaId deve ser um número inteiro' })
  turmaId?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === undefined ? undefined : Number(value),
  )
  @IsInt({ message: 'responsavelId deve ser um número inteiro' })
  responsavelId?: number;
}
