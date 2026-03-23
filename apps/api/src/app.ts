import "./types"
import express, { Express, Request, Response, NextFunction } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.config"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"

const app: Express = express()

app.use(cors())
app.use(express.json())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use("/auth", authRoutes)
app.use("/", userRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: "Internal server error" })
})

export default app
