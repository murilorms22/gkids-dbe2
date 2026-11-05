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
        where: { email: 'gerente@ifsul.edu.br' },
        update: {},
        create: { nome: 'Gerente', email: 'gerente@ifsul.edu.br', senha: senhaPadrao, role: 'GERENTE' },
    });

    await prisma.user.upsert({
        where: { email: 'user@ifsul.edu.br' },
        update: {},
        create: { nome: 'Comum', email: 'user@ifsul.edu.br', senha: senhaPadrao, role: 'USER' },
    });

    console.log('✅ Seed finalizado: Usuários de teste criados!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });