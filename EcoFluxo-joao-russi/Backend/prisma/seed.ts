import { Perfil } from "../generated/prisma/client.js";
import { hash } from "@node-rs/argon2";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Iniciando o seed...");

  // 1. DADOS DO GESTOR
  const emailGestor = "joao.russi@aluno.cps.sp.gov.br"; // Substituir por um e-mail que você tenha acesso
  const senhaGestor = "Gestor@123";          //subistituir por uma outra senha se achar necessário

  const gestorExistente = await prisma.usuario.findUnique({
    where: { email: emailGestor },
  });

  if (gestorExistente) {
    console.log("O usuário gestor já existe no banco de dados.");
  } else {
    const senhaHashGestor = await hash(senhaGestor);

    const gestor = await prisma.usuario.create({
      data: {
        nome: "Gestor EcoFluxo", //troque se achar necessário
        email: emailGestor,
        senha: senhaHashGestor,
        perfil: Perfil.GESTOR,
      },
    });

    console.log(`Gestor criado com sucesso! E-mail: ${gestor.email}`);
  }

  // 2. DADOS DO MORADOR
  const emailMorador = "recebadasilva123@gmail.com"; // E-mail diferente do gestor!troque por um que você tenha acesso
  const senhaMorador = "Morador@123";         //troque se achar necessário

  const moradorExistente = await prisma.usuario.findUnique({
    where: { email: emailMorador },
  });

  if (moradorExistente) {
    console.log("O usuário morador já existe no banco de dados.");
  } else {
    const senhaHashMorador = await hash(senhaMorador);

    const morador = await prisma.usuario.create({
      data: {
        nome: "Morador EcoFluxo", //troque se achar necessário
        email: emailMorador,
        senha: senhaHashMorador,
        perfil: Perfil.MORADOR,
      },
    });

    console.log(`Morador criado com sucesso! E-mail: ${morador.email}`);
  }
}

main()
  .catch((e) => {
    console.error("Erro ao executar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
