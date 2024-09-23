import z from 'zod'

const user_schema = z.object({
    id: z.string().optional(),
    name: z.string(),
    lastname: z.string(),
    company_name: z.string(),
    email: z.string().email(),
    phone_number: z.string().min(11).max(11),
    password: z.string().min(8),
    first_login: z.boolean().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    scheduled_days: z.array(z.string()).optional(),
    scheduled_time: z.string().optional(),
})

const first_login_schema = z.object({
    scheduled_days: z.string(),
    scheduled_time: z.string(),
    types_of_garbage: z.string(),
    city: z.string(),
    street: z.string(),
    first_login: z.boolean().optional()
})

const availability_schema = z.object({
    city: z.string(),
    days: z.array(z.object({
        Segundas: z.array(z.string()),
        Quartas: z.array(z.string())
    }))
    
})

const types_of_garbage_schema = z.array(z.string())

const login_schema =  z.object({
    email: z.string().email(),
    password: z.string()
})

export {user_schema, login_schema, first_login_schema, availability_schema, types_of_garbage_schema}