import express from "express";
import cors from "cors";
import routes from "./Routes/routes.js";
import swaggerUi from "swagger-ui-express";
// suporte para importar arquivo json usando ESModules
import {createRequire} from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
const app = new express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http/localhost:5173"
}));
// obrigatoriamente o swagger deve vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/ToDo", routes);
app.listen(5000);