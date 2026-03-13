import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
    async index({ response }: HttpContext) {
        const clients = await Client.all()
        return response.ok(clients)
    }

    async show({ params, response }: HttpContext) {
        const client = await Client.query()
            .where('id', params.id)
            .preload('transactions', (q) =>
                q.preload('transactionProducts', (tq) =>
                    tq.preload('product')
                )
            )
            .firstOrFail()
        
        return response.ok(client)
    }
}