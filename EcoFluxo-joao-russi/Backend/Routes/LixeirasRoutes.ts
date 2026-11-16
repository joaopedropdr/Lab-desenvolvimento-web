import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import LixeirasController from '../Controllers/LixeirasController.js';

const routerLixeira = Router();
// Rota com autenticação
routerLixeira.post("/createLixeiras", autenticacaoToken, autorizacaoPerfil, LixeirasController.Create);
routerLixeira.get("/getLixeiras", autenticacaoToken, autorizacaoPerfil, LixeirasController.GetLixeiras);


export default routerLixeira;
