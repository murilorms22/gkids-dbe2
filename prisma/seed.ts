import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { fakerPT_BR } from '@faker-js/faker';
import { criarDadosTurma } from './factories/turma.factory';
import { criarDadosResponsavel } from './factories/responsavel.factory';
import { criarDadosAluno } from './factories/aluno.factory';

const prisma = new PrismaClient();

async function main() {
    const senhaPadrao = await bcrypt.hash('123456', 10);

    await prisma.user.upsert({
        where: { email: 'admin@ifsul.edu.br' },
        update: {},
        create: { nome: 'Admin', email: 'admin@ifsul.edu.br', senha: senhaPadrao, role: 'ADMIN' },
    });

    await prisma.user.upsert({
        where: { email: 'direcao@ifsul.edu.br' },
        update: {},
        create: { nome: 'Direcao Escolar', email: 'direcao@ifsul.edu.br', senha: senhaPadrao, role: 'DIRECAO' },
    });

    await prisma.user.upsert({
        where: { email: 'gerente@ifsul.edu.br' },
        update: {},
        create: { nome: 'Gerente (Direcao)', email: 'gerente@ifsul.edu.br', senha: senhaPadrao, role: 'GERENTE' },
    });

    await prisma.user.upsert({
        where: { email: 'responsavel@ifsul.edu.br' },
        update: {},
        create: { nome: 'Responsavel', email: 'responsavel@ifsul.edu.br', senha: senhaPadrao, role: 'RESPONSAVEL' },
    });

    await prisma.user.upsert({
        where: { email: 'user@ifsul.edu.br' },
        update: {},
        create: { nome: 'Comum', email: 'user@ifsul.edu.br', senha: senhaPadrao, role: 'RESPONSAVEL' },
    });

    // cria turma padrao para testes caso nao exista
    const turma = await prisma.turma.upsert({
        where: { id: 1 },
        update: {},
        create: { nome: 'Maternal 1', turno: 'Manhã', ano_letivo: '2026' },
    });

    // cria responsavel padrao para testes caso nao exista
    const responsavel = await prisma.responsavel.upsert({
        where: { id: 1 },
        update: {},
        create: { nome: 'Carlos da Silva', cpf: '12345678900', telefone: '51999999999' },
    });

    // cria aluno padrao para testes caso nao exista
    await prisma.aluno.upsert({
        where: { id: 1 },
        update: {},
        create: {
            nome: 'Pedrinho da Silva',
            data_nascimento: new Date('2022-03-15'),
            turmaId: turma.id,
            responsavelId: responsavel.id,
        },
    });

    const totalTurmas = await prisma.turma.count();
    let novasTurmasCriadas = 0;
    let novosResponsaveisCriados = 0;
    let novosAlunosCriados = 0;

    if (totalTurmas <= 1) {
        // Cria mais 4 turmas (totalizando 5 turmas no banco)
        for (let i = 0; i < 4; i++) {
            await prisma.turma.create({
                data: criarDadosTurma(),
            });
            novasTurmasCriadas++;
        }

        // Cria mais 10 responsaveis garantindo CPF unico no banco
        for (let i = 0; i < 10; i++) {
            let dadosResponsavel = criarDadosResponsavel();
            let cpfExistente = await prisma.responsavel.findUnique({
                where: { cpf: dadosResponsavel.cpf },
            });
            while (cpfExistente) {
                dadosResponsavel = criarDadosResponsavel();
                cpfExistente = await prisma.responsavel.findUnique({
                    where: { cpf: dadosResponsavel.cpf },
                });
            }
            await prisma.responsavel.create({
                data: dadosResponsavel,
            });
            novosResponsaveisCriados++;
        }

        // Busca turmas e responsaveis existentes e cria mais 20 alunos vinculados aleatoriamente
        const turmasDisponiveis = await prisma.turma.findMany();
        const responsaveisDisponiveis = await prisma.responsavel.findMany();

        for (let i = 0; i < 20; i++) {
            const turmaSorteada = fakerPT_BR.helpers.arrayElement(turmasDisponiveis);
            const responsavelSorteado = fakerPT_BR.helpers.arrayElement(responsaveisDisponiveis);
            await prisma.aluno.create({
                data: criarDadosAluno(turmaSorteada.id, responsavelSorteado.id),
            });
            novosAlunosCriados++;
        }
    }

    const [countUsers, countTurmas, countResponsaveis, countAlunos] = await Promise.all([
        prisma.user.count(),
        prisma.turma.count(),
        prisma.responsavel.count(),
        prisma.aluno.count(),
    ]);

    console.log(
        `✅ Seed finalizado: +${novasTurmasCriadas} turmas, +${novosResponsaveisCriados} responsáveis e +${novosAlunosCriados} alunos gerados via Faker! ` +
        `(Total no banco: ${countUsers} usuários, ${countTurmas} turmas, ${countResponsaveis} responsáveis, ${countAlunos} alunos)`,
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
