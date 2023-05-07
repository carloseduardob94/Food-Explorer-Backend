const knex = require('../database/knex')

class ProductsController {
  async create(request, response) {
    const { title, description, price, units } = request.body
    const { user_id } = request.params

    await knex('products').insert({
      title,
      description,
      price,
      units,
      user_id
    })

    return response.status(201).json({ title, description, price, units })
  }
}

module.exports = ProductsController
