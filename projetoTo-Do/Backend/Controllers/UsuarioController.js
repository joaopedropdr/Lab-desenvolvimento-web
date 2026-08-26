import Usuario from "../Models/Usuario.js";
import {Types} from "mongoose";

export default class UsuarioController {
    // req: Dados da requisição do front
    // res: Resposta do back de sucesso ou erro.
    static async Create(req, res){
        const{nome, email, senha} = req.body;
        if(!nome || !email || !senha) return res.status(422).json({message: "Todos os dados devem ser preenchidos"});
        try {
            //criptografia da senha. Precisa da extensão argon2
            // const hashPassword = await argon2.hash(senha);
            const usuario = new Usuario({
                nome,
                email,
                senha,
                // senha:hashPassword
            });
            const novoUsuario = await usuario.save();
            return res.status(200).json({message: "Usuario criado com sucesso", novoUsuario});
        } catch(error) {
            return res.status(500).json({message: "Problema ao criar o usuario", error });
        }
    } //Fim Create

}