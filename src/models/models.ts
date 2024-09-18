import z from 'zod'

const user_schema = z.object({
    id: z.string().optional(),
    name: z.string(),
    lastname: z.string(),
    company_name: z.string(),
    email: z.string().email(),
    phone_number: z.string().min(11).max(11),
    password: z.string().min(8),
    scheduled_days: z.array(z.string()).optional(),
    scheduled_shift: z.string().optional(),
    first_login: z.boolean().optional()
})

const login_schema =  z.object({
    email: z.string().email(),
    password: z.string()
})

export {user_schema, login_schema}