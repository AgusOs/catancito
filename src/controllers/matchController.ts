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

        let now = new Date().toLocaleString()
        const match = await prisma.create(
            {
                data:{
                    creatorId, 
                    players,
                    winnerId,
                    created_at: now
                }
            }
        )

        res.status(200).json(match)

    } catch (error) {

        console.log(error)

        res.status(500).json(
            {
                error: 'Hubo un error al crear la partida'
            }
        )
        
    }

}

export const getAllMatches = async (req: Request, res: Response) : Promise<void> => {

    try {

        const matches = await prisma.findMany()
        res.status(200).json(matches);
        
    } catch (error: any) {

        console.log(error)
        res.status(500).json(
            {
                error: 'Hubo un error, reintente mas tarde'
            }
        )
        
    }

}

export const deleteMatch = async (req: Request, res: Response): Promise<void> => {

    const matchId = parseInt(req.params.id)

    try {
        await prisma.delete({
            where: {
                id: matchId
            }
        })

        res.status(200).json({
            message: `La partida ha sido eliminada`
        }).end()

    } catch (error: any) {

        if(error?.code === 'P2025'){
            res.status(404).json('Partida no encontrada')
        }else {
            console.log(error)
            res.status(500).json(
                {
                    error: 'Hubo un error, reintente mas tarde'
                }
            )
        }

    }
}