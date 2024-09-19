import express from 'express'
import cors from 'cors'
import { user_routes } from './routes/user-routes'
import { first_login_routes } from './routes/first-login'
import { ecoletar_info_routes } from './routes/ecoletar-infos'

const app = express()

app.use(cors())
app.use(express.json())

app.use(user_routes)
app.use(first_login_routes)
app.use(ecoletar_info_routes)

const port = process.env.PORT ?? 3000

const server = app.listen(port, () => {console.log("The server is listening")})

process.on("SIGTERM", () => {
    console.info("Received shutdown signal. Shutting down server...")
    server.close(() => {
        console.log("Server shut down successfully")
        process.exit(0)
    })
})

export default app