import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da turma é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O turno é obrigatório' })
  turno: string;

  @IsString()
  @IsNotEmpty({ message: 'O ano letivo é obrigatório' })
  ano_letivo: string;
}
