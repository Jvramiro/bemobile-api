import Transaction from '#models/transaction'
import GatewayService from '#services/gateway_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
    async index({ response }: HttpContext) {
        const transactions = await Transaction.query()
            .preload('client')
            .preload('gateway')
            .preload('transactionProducts', (q) => q.preload('product'))

        return response.ok(transactions)
    }

    async show({ params, response }: HttpContext) {
        const transaction = await Transaction.query()
            .where('id', params.id)
            .preload('client')
            .preload('gateway')
            .preload('transactionProducts', (q) => q.preload('product'))
            .firstOrFail()

        return response.ok(transaction)
    }

    async refund({ params, response, auth }: HttpContext) {
        if (auth.user!.role !== 'admin') {
            return response.forbidden({ message: 'Access denied' })
        }

        const transaction = await Transaction.query()
            .where('id', params.id)
            .preload('gateway')
            .firstOrFail()

        const gatewayService = new GatewayService()
        await gatewayService.refund({
            externalId: transaction.externalId!,
            gateway: { name: transaction.gateway.name },
        })

        transaction.status = 'refunded'
        await transaction.save()

        return response.ok({
            message: 'Refund sucessful',
            data: transaction
        })
    }
}