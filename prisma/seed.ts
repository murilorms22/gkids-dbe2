import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    console.log('✅ Seed finalizado: Dados de teste criados!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });