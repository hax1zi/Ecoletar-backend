/* eslint-disable @typescript-eslint/no-explicit-any */
import express  from "express"
import verify_token from "../middlewares/auth-middleware"
import { first_login_confirmation, first_login_verification, remove_info_in_ecoletar } from "../controllers/first-login-controller"
import { z, ZodError } from "zod"
import { first_login_schema } from "../models/models"

const first_login_routes = express.Router()

type first_login_schema = z.infer<typeof first_login_schema>

first_login_routes.get("/first-login", verify_token,async (req, res) => {
    try {
        const user_id_from_token = (req as any).id
    
        const response_first_login = await first_login_verification(user_id_from_token)
    
        res.status(200).json({ response: response_first_login})
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados' })
          } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
          }
    }
})

first_login_routes.post("/confirmation", verify_token, async (req,res) => {
    try {
        const user_id_from_token = (req as any).id
        const parsed_first_login = first_login_schema.parse(req.body)

        await first_login_confirmation(parsed_first_login, user_id_from_token)

        const response_remove = await remove_info_in_ecoletar(parsed_first_login)

        res.status(200).json({response: response_remove})

    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados' })
          } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
          }
    }
    
})


export {first_login_routes}