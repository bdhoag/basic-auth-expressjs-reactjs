import { User } from "../models"
import { AppError, UserDTO } from "../types"

const findById = async (id: string): Promise<UserDTO> => {
  const user = await User.findByPk(id, {
    attributes: ["id", "name", "email"],
  })

  if (!user) {
    const error: AppError = new Error("User not found")
    error.statusCode = 404
    throw error
  }

  return { id: user.id, name: user.name, email: user.email }
}

export { findById }
