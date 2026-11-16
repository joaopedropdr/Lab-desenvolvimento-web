import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import EcopontoController from '../Controllers/EcopontoController.js';

const routerEcoponto = Router();
// Rota com autenticação
// routerEcoponto.post("/createEcoponto", autenticacaoToken, 
//     autorizacaoPerfil("GESTOR"), EcopontoController.Create);
// Rota sem autenticação para testar
routerEcoponto.post("/createEcoponto",  EcopontoController.Create);
routerEcoponto.get("/getEcopontos", EcopontoController.getEcopontos);


export default routerEcoponto;
