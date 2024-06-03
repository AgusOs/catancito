import { Request, Response } from "express";
import { hashPasword } from "../services/password.service";
import prisma from "../models/user/user";

export const register = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body

    try {
        
        const hashedPassword = await hashPasword(password)
        const user = await prisma.create(
            {
                data:{
                    email,
                    password: hashedPassword
                }
            }
        )

    } catch (error) {
        
    }

}