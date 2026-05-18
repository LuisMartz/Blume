import cors from 'cors'
import dotenv from 'dotenv'
import express, { type ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { catalogRouter } from './routes/catalog.routes.js'
import { clientsRouter } from './routes/clients.routes.js'
import { quotesRouter } from './routes/quotes.routes.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? 'http://127.0.0.1:5173',
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/clients', clientsRouter)
app.use('/api/catalog', catalogRouter)
app.use('/api/quotes', quotesRouter)

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Datos no válidos',
      issues: error.issues,
    })
    return
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Recurso no encontrado' })
      return
    }
  }

  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor' })
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Blume API listening on http://localhost:${port}`)
})
