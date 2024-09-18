/* eslint-disable @typescript-eslint/no-explicit-any */
import express  from 'express'
import z, { ZodError } from 'zod'
import {user_schema, login_schema } from '../models/models'
import {check_email, check_login, create_user, delete_user, get_users, update_user} from '../controllers/user-controller'
import {v4 as uuidv4} from 'uuid'
import { hash_password } from '../utils/bcryptUtils'
import jwt, { Secret } from 'jsonwebtoken'

import * as dotenv from 'dotenv';
import verify_token from '../middlewares/auth-middleware'
dotenv.config();

const secret_key = process.env.SECRET_KEY


type user_schema = z.infer<typeof user_schema>

const user_routes = express.Router()

user_routes.get('/users', async ( req, res) => {
    const data = await get_users()
    return res.status(200).json(data)
})

user_routes.post('/login', async (req, res) => {
    try {

        const parsed_login = login_schema.parse(req.body)
    
        const result = await check_login(parsed_login)
    
        if (result && result.check) {
            const token = jwt.sign({ID: result.user_ID}, secret_key as Secret)
            return res.status(200).json({ message: 'Usuário autenticado com sucesso', token})
        }
    
        return res.status(401).json({ error: 'Email ou senha incorretos' })
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados'})
          } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados'})
          }
    }
})

user_routes.post('/register', async (req, res) => {
    try {
        const id = uuidv4()

        const parsed_user = user_schema.parse(req.body)

        const response_check_email = await check_email(parsed_user.email)

        if(response_check_email) {
            return (res.status(401).json({ error: "Email ja cadastrado"}))
        }
        
        const password: string = await hash_password(parsed_user.password)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...user_without_password } = parsed_user


        const data: user_schema = {
            id,
            password,
            ...user_without_password,
            first_login: true,
        }
        
        await create_user(data)

        res.status(201).json({message: "Usuário criado com sucesso"})
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados'})
          } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados'})
          }
    }
})


user_routes.put("/user-edit/:id", verify_token, async (req, res) => {
    try {
        const id = req.params.id
        const parsed_user = user_schema.parse(req.body)
        const user_id_from_token = (req as any).id
        
        const password: string = await hash_password(parsed_user.password)
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...user_without_password } = parsed_user
        
        const data: user_schema = {
            password,
            ...user_without_password
        }
        if (user_id_from_token !== id) {
            return res.status(403).json({ error: 'Ação não permitida' });
        } else {
            const response_update_user = await update_user(id, data)
            
            if (!response_update_user) {
                return res.status(404).json({error: 'Id não foi encontrado'})
            } else {
                return res.status(200).json({message: "Editado com sucesso"})
            }
        }
        
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados' })
          } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
          }
    }
})

user_routes.delete('/delete/:id', verify_token, async (req, res) => {
    try {

        const id = req.params.id
        const user_id_from_token = (req as any).id
    
        
        if (user_id_from_token !== id) {
            return res.status(403).json({ error: 'Ação não permitida' });
        } else {
            const response_delete = await delete_user(id)
            if (response_delete) {
               return res.status(200).json({message: "Deletado com sucesso"})
           } else {
               return res.status(404).json({error: 'Id não foi encontrado'})
           }
        }
    
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados' })
          } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
          }
    }
})

export { user_routes }