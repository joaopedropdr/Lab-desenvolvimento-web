import Tarefa from "../Models/tarefa.js";
import {Types} from "mongoose";

export default class TarefaController {
    // req: Dados da requisição do front
    // res: Resposta do back de sucesso ou erro.
    static async Create(req, res){
        const{titulo, descricao, dataLimite,situacao} = req.body;
        if(!titulo || !descricao || !dataLimite || !situacao) return res.status(422).json({message: "Todos os dados devem ser preenchidos"});
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao
            });
            const novaTarefa = await tarefa.save();
            return res.status(200).json({message: "Tarefa salva com sucesso", novaTarefa});
        } catch(error) {
            return res.status(500).json({message: "Problema ao salvar a tarefa", error });
        }
    } //Fim Create

    static async GetAll(req, res){
        try {
            const tarefas = await Tarefa.find();
            return res.status(200).json({message: "Todas as tarefas retornadas com sucesso", tarefas});
        } catch(erro) {
            return res.status(500).json({message: "Problema ao retornar as tarefas", erro});
        }
    } //Fim GetAll
}