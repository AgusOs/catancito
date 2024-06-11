import { Request, Response } from "express";
import { hashPasword } from "../services/password.service";
import prisma from '../models/user/user';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const { email, password, user_name } = req.body

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

        res.status(201).json(user)

    } catch (error: any) {

        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({
                message: 'El email ingresado ya existe'
            })
        }

        if(error?.code === 'P2002' && error?.meta?.target?.includes('user_name')){
            res.status(400).json({
                message: 'El nombre de usurio ingresado ya existe'
            })
        }

        console.log(error)
        res.status(500).json(
            {
                error: 'Hubo un error, reintente mas tarde'
            }
        )

    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {

    try {

        const users = await prisma.findMany()
        res.status(200).json(users);
        
    } catch (error: any) {

        console.log(error)
        res.status(500).json(
            {
                error: 'Hubo un error, reintente mas tarde'
            }
        )
        
    }

}

export const getUserById = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id)

    try {

        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(404).json({
                error: 'El usuario no fue encontrado'
            })
            return
        }

        res.status(200).json(user);
        
    } catch (error: any) {

        console.log(error)
        res.status(500).json(
            {
                error: 'Hubo un error, reintente mas tarde'
            }
        )
        
    }

}

export const updateUser = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id)
    const { email, password, user_name, profile_img } = req.body

    try {

        let dataToUpdate: any = { ...req.body }

        if(password){
            const hashedPassword = await hashPasword(password)
            dataToUpdate.password = hashedPassword
        }

        if(email){
            dataToUpdate.email = email
        }

        if(user_name){
            dataToUpdate.user_name = user_name
        }

        if(profile_img){
            dataToUpdate.profile_img = profile_img
        }

        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user);
        
    } catch (error: any) {

        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({
                error: 'El email ingresado ya existe'
            })
        }else if(error?.code === 'P2025'){
            res.status(404).json('Usuario no encontrado')
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

export const deleteUser = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id)

    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminado`
        }).end()

    } catch (error: any) {

        if(error?.code === 'P2025'){
            res.status(404).json('Usuario no encontrado')
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

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    
}