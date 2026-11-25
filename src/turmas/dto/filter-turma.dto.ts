import { IsOptional, IsString } from 'class-validator';

export class FilterTurmaDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  turno?: string;

  @IsOptional()
  @IsString()
  ano_letivo?: string;
}
