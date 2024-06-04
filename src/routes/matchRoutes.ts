import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createMatch, deleteMatch, getAllMatches } from '../controllers/matchController';

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//Middleware de JWT para ver si estamos autenticados
const authToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({ error: 'No autorizado' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if(err){
            console.error('Error en la autenticacion: ', err)
            return res.status(403).json({
                message: 'No tienes acceso a a este recurso'
            })
        }

        next()
    
    })

}

//TODO definir rutas
router.post('/', authToken, createMatch)
router.get('/', authToken, getAllMatches)
router.delete('/:id', authToken, deleteMatch)

export default router;