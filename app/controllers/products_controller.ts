import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {

    async index({ response }: HttpContext) {
        const products = await Product.all()
        return response.ok(products)
    }

    async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'amount'])
        const product = await Product.create(data)
        return response.created({
            message: 'Product sucessfully created',
            data: product
        })
    }

    async update({ params, request, response }: HttpContext) {
        const product = await Product.findOrFail(params.id)
        product.merge(request.only(['name, amount']))
        await product.save()
        return response.ok({
            message: 'Product successfully updated',
            data: product
        })
    }

    async destroy({ params, response}: HttpContext) {
        const product = await Product.findOrFail(params.id)
        await product.delete()
        return response.ok({
            message: `Product ${product.name} successfully deleted`
        })
    }

}