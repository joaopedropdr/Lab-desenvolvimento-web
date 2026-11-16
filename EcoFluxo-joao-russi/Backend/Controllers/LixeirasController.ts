import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

// AJUSTE conforme o enum Tipo do seu schema.prisma
const TIPOS_VALIDOS = ["PLASTICO", "PAPEL", "VIDRO", "METAL", "ORGANICO"] as const; 
type TipoLixeira = (typeof TIPOS_VALIDOS)[number];

export default class LixeiraController {
    static async Create(req: Request, res: Response) {
        try {
            const { uuid_sensor, tipo, volume_max, nivel_cheio, ecoponto_id } = req.body;
            if (!uuid_sensor || !tipo || !volume_max || !nivel_cheio || !ecoponto_id) {
                return res.status(400).json({
                    message:
                        "Os campos uuid_sensor, tipo, volume_max, nivel_cheio e ecoponto_id são obrigatórios.",
                });
            }

            // Valida o tipo contra o enum
            if (!TIPOS_VALIDOS.includes(tipo as TipoLixeira)) {
                return res.status(400).json({
                    message: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(", ")}.`,
                });
            }

            // Valida os campos numéricos
            const volumeMax = Number(volume_max);
            const nivelCheio = Number(nivel_cheio);
            const ecopontoId = Number(ecoponto_id);

            if (!Number.isInteger(volumeMax) || volumeMax <= 0) {
                return res.status(400).json({
                    message: "volume_max deve ser um número inteiro maior que zero.",
                });
            }

            if (!Number.isInteger(nivelCheio) || nivelCheio <= 0 || nivelCheio > volumeMax) {
                return res.status(400).json({
                    message: "nivel_cheio deve ser um inteiro maior que zero e não maior que volume_max.",
                });
            }

            if (!Number.isInteger(ecopontoId) || ecopontoId <= 0) {
                return res.status(400).json({ message: "ecoponto_id inválido." });
            }

            // Verifica se o ecoponto existe
            const ecoponto = await prisma.ecoponto.findUnique({
                where: { id: ecopontoId },
            });

            if (!ecoponto) {
                return res.status(404).json({ message: "Ecoponto não encontrado." });
            }

            const novaLixeira = await prisma.lixeira.create({
                data: {
                    uuid_sensor: uuid_sensor.trim(),
                    tipo,
                    volume_max: volumeMax,
                    nivel_cheio: nivelCheio,
                    ecoponto_id: ecopontoId,
                },
            });

            return res.status(201).json({
                message: "Lixeira cadastrada com sucesso.",
                lixeira: novaLixeira,
            });
        } catch (error) {
            console.error("Erro ao criar lixeira:", error);
            return res.status(500).json({
                message: "Erro interno do servidor ao cadastrar a lixeira.",
            });
        }
    }

    static async GetLixeiras(req: Request, res: Response) {
        try {
            const lixeiras = await prisma.lixeira.findMany({
                orderBy: { criadoEm: "desc" },
                include: {
                    ecoponto: {
                        select: { id: true, nome: true },
                    },
                },
            });

            return res.status(200).json(lixeiras);
        } catch (error) {
            console.error("Erro ao buscar lixeiras:", error);
            return res.status(500).json({
                message: "Erro interno do servidor ao buscar as lixeiras.",
            });
        }
    }
}