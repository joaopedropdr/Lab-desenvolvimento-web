import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";

const routesTarefa = new Router();
// Rotas da API
routesTarefa.post("/Create", TarefaController.Create);
routesTarefa.get("/GetAll", TarefaController.GetAll);
export default routesTarefa;