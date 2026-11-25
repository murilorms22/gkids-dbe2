import { fakerPT_BR } from '@faker-js/faker';

export function criarDadosAluno(turmaId: number, responsavelId: number) {
  return {
    nome: fakerPT_BR.person.fullName(),
    data_nascimento: fakerPT_BR.date.birthdate({ min: 1, max: 5, mode: 'age' }),
    turmaId,
    responsavelId,
  };
}
