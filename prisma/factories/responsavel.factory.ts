import { fakerPT_BR } from '@faker-js/faker';

const cpfsGerados = new Set<string>(['12345678900']);

function gerarCpfUnico(): string {
  let cpf = fakerPT_BR.string.numeric(11);
  while (cpfsGerados.has(cpf)) {
    cpf = fakerPT_BR.string.numeric(11);
  }
  cpfsGerados.add(cpf);
  return cpf;
}

export function criarDadosResponsavel() {
  return {
    nome: fakerPT_BR.person.fullName(),
    cpf: gerarCpfUnico(),
    telefone: `519${fakerPT_BR.string.numeric(8)}`,
  };
}
