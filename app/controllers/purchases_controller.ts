import type { HttpContext } from '@adonisjs/core/http'
import Client from "#models/client"
import Product from "#models/product"
import Transaction from "#models/transaction"
import TransactionProduct from "#models/transaction_product"
import GatewayService from "#services/gateway_service"
import { createPurchaseValidator } from '#validators/purchase'

export default class PurchasesController {
    async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(createPurchaseValidator)

        const product = await Product.findOrFail(data.productId)
        const amount = product.amount * data.quantity

        let client = await Client.findBy('email', data.email)
        if(!client){
            client = await Client.create({
                name: data.name,
                email: data.email
            })
        }

        const gatewayService = new GatewayService()
        const result = await gatewayService.charge({
            amount: amount,
            name: data.name,
            email: data.email,
            cardNumber: data.cardNumber,
            cvv: data.cvv
        })

        const transaction = await Transaction.create({
            clientId: client.id,
            gatewayId: result.gateway.id,
            externalId: String(result.externalId),
            status: 'approved',
            amount: amount,
            cardLastNumbers: data.cardNumber.slice(-4)
        })

        await TransactionProduct.create({
            transactionId: transaction.id,
            productId: product.id,
            quantity: data.quantity
        })

        return response.created({
            message: 'Purchase successful',
            data: transaction
        })
    }
}