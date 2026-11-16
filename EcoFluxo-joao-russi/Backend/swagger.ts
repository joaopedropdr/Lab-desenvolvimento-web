import swaggerAutogen from "swagger-autogen";

const doc: Record<string, unknown> = {
    info: {
        title: "API EcoFluxo",
        description: "Documentação para a geração automática dos testes",
    },
    host: "localhost:5000",
    basePath: "/EcoFluxo",
};

const outputFile: string = "./swagger-output.json";
const endpointsFiles: string[] = ["./Routes/EcopontoRoutes.ts", "./Routes/LixeirasRoutes.ts", "./Routes/UsuarioRoutes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);