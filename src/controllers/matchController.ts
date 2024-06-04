import { Request, Response } from "express";
import prisma from '../models/match/match';

export const createMatch = async (req: Request, res: Response): Promise<void> => {

    try {
        
        const { creatorId, players, winnerId } = req.body

        if(!players){
            res.status(400).json({
                message: 'Debe seleccionar a los participantes'
            })
            return
        }

        if(!winnerId){
            res.status(400).json({
                message: 'Debe seleccionar un ganador'
            })
            return
        }

        const match = await prisma.create(
            {
                data:{
                    creatorId,
                    players,
                    winnerId,
                }
            }
        )

        res.status(200).json(match)

    } catch (error) {

        res.status(500).json(
            {
                error: 'Hubo un error al crear la partida'
            }
        )
        
    }

}