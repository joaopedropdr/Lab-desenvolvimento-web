import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

export default class EcopontoController {
    static async Create(req: Request, res: Response) {
        try {
            const {
                nome,
                latitude,
                longitude,
                descricao,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                uf,
                nota,
            } = req.body;

            // Verificação dos dados obrigatórios
            if (!nome || !latitude || !longitude) {
                return res.status(400).json({
                    message: "Os campos nome, latitude e longitude são obrigatórios.",
                });
            }

            // Verifica se o ecoponto já está cadastrado
            // Estou usando a latitude e longitude pois não tem campo unique.
            const ecopontoExistente = await prisma.ecoponto.findFirst({
                where: {
                    latitude: latitude,
                    longitude: longitude,
                },
            });

            if (ecopontoExistente) {
                return res.status(409).json({
                    message: "Já existe um ecoponto cadastrado nessa localização.",
                });
            }

            // Inserção no banco de dados
            const novoEcoponto = await prisma.ecoponto.create({
                data: {
                    nome: nome,
                    latitude: latitude,
                    longitude: longitude,
                    descricao: descricao ?? null,
                    cep: cep ?? null,
                    logradouro: logradouro ?? null,
                    numero: numero ?? null,
                    bairro: bairro ?? null,
                    cidade: cidade ?? null,
                    uf: uf ?? null,
                    nota: nota !== undefined && nota !== null ? Number(nota) : null,
                },
            });

            return res.status(200).json({
                message: "Ecoponto cadastrado com sucesso.",
                ecoponto: novoEcoponto,
            });
        } catch (error) {
            console.error("Erro ao criar ecoponto:", error);
            return res.status(500).json({
                message: "Erro interno do servidor ao cadastrar o ecoponto.",
            });
        }
    }

    static async getEcopontos(req: Request, res: Response) {
        try {
            const ecopontos = await prisma.ecoponto.findMany({
                orderBy: { criadoEm: "desc" },
            });

            return res.status(200).json(ecopontos);
        } catch (error) {
            console.error("Erro ao buscar ecopontos:", error);
            return res.status(500).json({
                message: "Erro interno do servidor ao buscar os ecopontos.",
            });
        }
    }
}