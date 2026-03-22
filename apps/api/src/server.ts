import "dotenv/config"
import "./types"
import swaggerUi from "swagger-ui-express"
import { sequelize } from "./config/db.config"
import { swaggerSpec } from "./config/swagger.config"
import app from "./app"

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.APP_PORT || 3000

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
