import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";

const routes = new Router();
// Rotas da API
routes.post("/Create", TarefaController.Create);
routes.get("/GetAll", TarefaController.GetAll);
export default routes;