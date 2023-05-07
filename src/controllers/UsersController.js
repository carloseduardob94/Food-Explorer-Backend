const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
const { hash, compare } = require('bcryptjs')

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdmin } = request.body
    const database = await sqliteConnection()
    const checkUserExist = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (checkUserExist) {
      throw new AppError('Este e-mail já está em uso')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, isAdmin]
    )

    return response.status(201).json({ name, email, password, isAdmin })

    if (!isAdmin) {
      throw new AppError('Restrito a ADMIN')
    }

    response.status(201).json({ name, email, password, isAdmin })
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])

    if (!user) {
      throw new AppError('Usuário não existe no banco de dados')
    }

    const userUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userUpdatedEmail && userUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError(
        'Você precisa informar a senha antiga para definir uma nova senha'
      )
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Senha antiga não confere')
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `
    UPDATE users SET 
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?
    `,
      [user.name, user.email, user.password, id]
    )

    return response.status(200).json()
  }
}

module.exports = UsersController
