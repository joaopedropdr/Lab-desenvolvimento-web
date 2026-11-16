import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import routerEcoponto from "./Routes/EcopontoRoutes.js";
import { createRequire } from "module";
import routerLixeira from "./Routes/LixeirasRoutes.js";
import routerUsuario from "./Routes/UsuarioRoutes.js";
//importar as rotas
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}));
app.use(express.json());
app.use(cookieParse());
//incluir rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/EcoFluxo", routerEcoponto);
app.use("/EcoFluxo", routerLixeira);
app.use("/EcoFluxo", routerUsuario);
app.listen(PORT, ()=>{
    console.log `Servidor rodando na porta ${PORT}`;
});
