import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

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