const { Router } = require('express')
const productsRoutes = Router()

// function MyMiddleware(request, response, next) {
//   console.log('Você passou pelo Middleware')

//   if (!request.body.isAdmin) {
//     return response.json({ message: 'user unauthorized' })
//   }

//   next()
// }

const ProductsController = require('../controllers/ProductsController')
const productsController = new ProductsController()

productsRoutes.post('/:user_id', productsController.create)

module.exports = productsRoutes
