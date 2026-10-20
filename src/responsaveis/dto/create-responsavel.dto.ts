import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateResponsavelDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do responsável é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Length(11, 14, { message: 'O CPF deve ter entre 11 e 14 caracteres' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  telefone: string;
}