import Usuario from "../Models/Usuario.js";
import {Types} from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken"

export default class UsuarioController {
    // req: Dados da requisição do front
    // res: Resposta do back de sucesso ou erro.
    static async Create(req, res){
        const{nome, email, senha} = req.body;
        if(!nome || !email || !senha) return res.status(422).json({message: "Todos os dados devem ser preenchidos"});
        try {
            //criptografia da senha. Precisa da extensão argon2
            const hashPassword = await argon2.hash(senha);
            const usuario = new Usuario({
                nome,
                email,
                senha:hashPassword
            });
            const novoUsuario = await usuario.save();
            return res.status(200).json({message: "Usuario criado com sucesso", novoUsuario});
        } catch(error) {
            // 11000 é o código que o MongoDB dispara quando o 'unique: true' é violado
            if (error.code === 11000) return res.status(400).json({ message: "O e-mail fornecido já está em uso."});

            return res.status(500).json({message: "Problema ao criar o usuario", error });
        }
    } //Fim Create

    static async Login(req, res){ 
        const{email, senha} = req.body;
        if(!email || !senha) return res.status(422).json({message: "Todos os dados devem ser preenchidos"});
        try {
            // Metodo select faz com que a senha retorne do banco, por padrao ela não é retornada na consulta.  
            const usuario = await Usuario.findOne({ email: email }).select("+senha")
            if(!usuario || !usuario.senha) return res.status(401).json({message: "Crendenciais incorretas. Verifique o email ou a senha digitado."})
            const verifyPassword = await argon2.verify(usuario.senha, senha)
            if(!verifyPassword) return res.status(401).json({message: "Crendenciais incorretas. Verifique o email ou a senha digitado."})
            
            const tokenPayload = {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "7d"})
            res.cookie('token', token, {
                httpOnly: true,  
                secure: false, // true apenas em produção (HTTPS)                       
                sameSite: 'lax',   // Protege contra ataques CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000  // Tempo de vida em milissegundos (7 dias)
            });
            return res.status(200).json({ message: 'Login realizado com sucesso!', 
                usuario: {
                    nome: usuario.nome,
                    email: usuario.email
                },
                token 
            });
        } catch(erro) {
            return res.status(500).json({ message: 'Erro ao realizar o login', erro });
        }
    } // Fim login

    static async EditarSenhaEsquecida(req, res) {
        const{token, novaSenha} = req.body 
        if(!token || !novaSenha) return res.status(400).json({ message: "Token e nova senha são obrigatórios." });
    }
    //editarSenha
    //esqueceuSenha

    // Verificação do token
    authToken(req, res, next) {
        const authHeader = req.headers['authorization'] 
        const token = authHeader?.split(' ')[1]

        if(!token) return res.sendStatus(401)
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return res.sendStatus(401)
            req.user = user
            next()
        })

    } // Fim authToken

}