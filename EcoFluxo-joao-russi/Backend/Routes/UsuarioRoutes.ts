import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import UsuarioController from '../Controllers/UsuarioController.js';

const routerUsuario = Router();
routerUsuario.post("/create", autenticacaoToken, autorizacaoPerfil, UsuarioController.Create);
routerUsuario.post("/login",  UsuarioController.Login);
routerUsuario.post("/verify-2fa", UsuarioController.Verify2FA);
routerUsuario.post("/logout", UsuarioController.Logout);
routerUsuario.get("/profile", autenticacaoToken, UsuarioController.Profile);

export default routerUsuario;
