import {Router} from "express";
import UsuarioController from "../Controllers/UsuarioController.js";

const routesUsuario = new Router();
// Rotas da API
routesUsuario.post("/CreateUsuario", UsuarioController.Create);
// routesTarefa.get("/GetAll", TarefaController.GetAll);
export default routesUsuario;