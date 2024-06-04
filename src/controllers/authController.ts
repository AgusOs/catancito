import { Request, Response } from "express";
import { comparePasswords, hashPasword } from "../services/password.service";
import prisma from "../models/user/user";
import { generateToken } from "../services/auth.service";

export const register = async(req: Request, res: Response): Promise<void> => {

    const { email, user_name, password } = req.body

    try {
        
        if(!email){
            res.status(400).json({
                message: 'El email es obligatorio'
            })
            return
        }
        
        if(!user_name){
            res.status(400).json({
                message: 'El nombre de usuario es obligatorio'
            })
            return
        }

        if(!password){
            res.status(400).json({
                message: 'El password es obligatorio'
            })
            return
        }
        
        const hashedPassword = await hashPasword(password)

        const user = await prisma.create(
            {
                data:{
                    email,
                    user_name,
                    password: hashedPassword
                }
            }
        )

        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error: any) {

        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({
                message: 'El email ingresado ya existe'
            })
        }

        if(error?.code === 'P2002' && error?.meta?.target?.includes('user_name')){
            res.status(400).json({
                message: 'El nombre de usuario ingresado ya existe'
            })
        }

        console.log(error)
        res.status(500).json(
            {
                error: 'Hubo un error en el registro'
            }
        )

    }

} 

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body
    
    try {

        if(!email){
            res.status(400).json({
                message: 'El email es obligatorio'
            })
            return
        }
        
        if(!password){
            res.status(400).json({
                message: 'El password es obligatorio'
            })
            return
        }
        
        const user = await prisma.findUnique({ where: {email} })
        if(!user){
            res.status(404).json({ error: 'Usuario y contraseña no coinciden' })
            return //Usamos mensaje de error genérico
        }

        const passwordMatch = await comparePasswords(password, user.password)
        if(!passwordMatch){
            res.status(401).json({
                error: 'Usuario y contraseña no coinciden'
            })
            return
        }

        const token = generateToken(user)
        res.status(200).json({ token })

    } catch (error:any) {
        console.log('Error: ', error)
    }

}