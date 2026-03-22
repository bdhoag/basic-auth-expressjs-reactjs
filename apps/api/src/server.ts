import path from "path"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../../.env") })
}

import "./types"
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { sequelize } from "./config/db.config"
import { swaggerSpec } from "./config/swagger.config"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"

const app = express()

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

const PORT = process.env.APP_PORT || 5000

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log("DB connected")

    await sequelize.sync()
    console.log("Models synchronized")

    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("DB connection failed:", (error as Error).message)
    process.exit(1)
  }
}

startServer()
