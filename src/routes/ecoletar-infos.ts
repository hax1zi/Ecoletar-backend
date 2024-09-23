import express from 'express'
import { get_availability} from '../controllers/ecoletar-controller'
import { ZodError } from 'zod'

const ecoletar_info_routes = express.Router()

ecoletar_info_routes.get(("/info/availability"), async (req, res) => {
    try {
        const response_avaibility = await get_availability()
        res.status(201).json({ data: response_avaibility})
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: 'Erro de validação dos dados'})
        } else {
            res.status(503).json({ error: 'O servidor não conseguiu receber os dados'})
        }
    }
})

export {ecoletar_info_routes}