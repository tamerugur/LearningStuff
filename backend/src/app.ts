import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
