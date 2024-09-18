/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config();

const secret_key = process.env.SECRET_KEY

interface request_with_id extends Request {
    id?: string
}

const verify_token = (req: request_with_id, res: Response, next: NextFunction) =>  {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split(' ')[1]

    if (!token) {
        return res.status(401).json({error: "Token não fornecido"})
    }  

     
    jwt.verify(token, secret_key as Secret, (err, decode: any) => {
        if (err) {
            return res.status(403).json({error: "Token inválido"})
        } else {
            req.id = decode.ID
            next()
        }
    })

}

export default verify_token