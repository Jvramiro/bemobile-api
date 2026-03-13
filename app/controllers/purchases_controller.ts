import type { HttpContext } from '@adonisjs/core/http'
import Client from "#models/client"
import Product from "#models/product"
import Transaction from "#models/transaction"
import TransactionProduct from "#models/transaction_product"
import GatewayService from "#services/gateway_service"

export default class PurchasesController {
    async store({ request, response }: HttpContext) {
        const { productId, quantity, name, email, cardNumber, cvv } = request.all()

        const product = await Product.findOrFail(productId)
        const amount = product.amount * quantity

        let client = await Client.findBy('email', email)
        if(!client){
            client = await Client.create({ name, email })
        }

        const gatewayService = new GatewayService()
        const result = await gatewayService.charge({ amount, name, email, cardNumber, cvv })

        const transaction = await Transaction.create({
            clientId: client.id,
            gatewayId: result.gateway.id,
            externalId: String(result.externalId),
            status: 'approved',
            amount: amount,
            cardLastNumbers: cardNumber.slice(-4)
        })

        await TransactionProduct.create({
            transactionId: transaction.id,
            productId: product.id,
            quantity: quantity
        })

        return response.created({
            message: 'Purchase successful',
            data: transaction
        })
    }
}