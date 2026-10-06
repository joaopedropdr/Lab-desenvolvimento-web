import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import routesTarefa from "./Routes/routesTarefa.js";
import routesUsuario from "./Routes/routesUsuario.js";
import swaggerUi from "swagger-ui-express";
// suporte para importar arquivo json usando ESModules
import {createRequire} from "module";
dotenv.config();
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
const app = new express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));
// obrigatoriamente o swagger deve vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/ToDo", routesTarefa);
app.use("/ToDo", routesUsuario);
app.listen(5000);

