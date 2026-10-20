import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do aluno é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  data_nascimento: string;

  @IsInt({ message: 'O ID da turma deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O ID da turma é obrigatório' })
  turmaId: number;

  @IsInt({ message: 'O ID do responsável deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O ID do responsável é obrigatório' })
  responsavelId: number;
}