import swaggerAutogen from "swagger-autogen";
const doc = {
    info: {
        title: "API ToDo List",
        description: "Documentação para a geração automatica dos testes com o swagger"
    },
    host: "localhost/5000",
    basePath: "/ToDo", 
}
// Nome do arquivo gerado pelo swagger
const outputFile = './swagger-output.json'; 
// caminho para as rotas da api
const routesFile = ['./Routes/routes.js'];
swaggerAutogen()(outputFile, routesFile, doc);
