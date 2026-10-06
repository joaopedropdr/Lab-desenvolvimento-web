import {Router} from "express";
import UsuarioController from "../Controllers/UsuarioController.js";

const routesUsuario = new Router();
// Rotas da API
routesUsuario.post("/CreateUsuario", UsuarioController.Create);
routesUsuario.post("/Login", UsuarioController.Login);
export default routesUsuario;