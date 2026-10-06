import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao, participam} = req.body;
        const usuarioLogado = req.user.id;
        if(!titulo || !descricao || !dataLimite || !situacao)
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao,
                criadoPor: usuarioLogado,
                participam: Array.isArray(participam)? 
                participam : (participam ? [participam] : [])

            });
            const novaTarefa = await tarefa.save();
            const tarefaPopulada = await Tarefa.findById(
                novaTarefa._Id)
                .populate("criadoPor", "nome email")
                .populate("participam", "nome email");
            res.status(200).json({message:"Tarefa inserida com sucesso", novaTarefa:tarefaPopulada});
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir uma tarefa", error});
        }
    }//fim create
    static async getAll(req, res){
        const usuarioLogado = req.user.id;
        try {
            const tarefas = await Tarefa.find({
                    $or:[
                        {criadoPor:usuarioLogado},
                        {participam: usuarioLogado}
                    ]
                })
                .populate("criadoPor", "nome")
                .populate("participam", "nome")
                .sort({ createdAt: -1 });
            
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas});
        } catch (error) {
            return res.status(500).json({message:"Erro ao buscar todas tarefas", error});
        }

    }//fim getAll

    static async editStatus(req, res) {
        try {
            const {idTarefa, novoStatus} = req.body; // 'pendente', 'finalizada' ou 'cancelada'
            if(!idTarefa || !novoStatus) {
                return res.status(404).json({ error: "Tarefa não encontrada." });
            }
            const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
                idTarefa, 
                {situacao: novoStatus}, 
                { returnDocument: 'after' } // Retorna o documento já atualizado
            ).populate("criadoPor", "nome")
            .populate("participam", "nome");

            res.status(200).json({message:"Status modificado com sucesso", tarefaAtualizada });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Erro ao atualizar status." });
        }
    }
}