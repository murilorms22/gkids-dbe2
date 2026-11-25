import { fakerPT_BR } from '@faker-js/faker';

const NIVEIS = [
  'Berçário I',
  'Berçário II',
  'Maternal I',
  'Maternal II',
  'Pré I',
  'Pré II',
];

const COMPLEMENTOS = ['A', 'B', 'Estrelinhas', 'Girassol', 'Arco-Íris'];

const TURNOS = ['Manhã', 'Tarde', 'Integral'];

export function criarDadosTurma() {
  const nivel = fakerPT_BR.helpers.arrayElement(NIVEIS);
  const complemento = fakerPT_BR.helpers.arrayElement(COMPLEMENTOS);

  return {
    nome: `${nivel} - ${complemento}`,
    turno: fakerPT_BR.helpers.arrayElement(TURNOS),
    ano_letivo: '2026',
  };
}
