const { Router } = require('express')
const usersRoutes = Router()

// function MyMiddleware(request, response, next) {
//   console.log('Você passou pelo Middleware')

//   if (!request.body.isAdmin) {
//     return response.json({ message: 'user unauthorized' })
//   }

//   next()
// }

const UsersController = require('../controllers/UsersController')
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)
usersRoutes.put('/:id', usersController.update)

module.exports = usersRoutes
