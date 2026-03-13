import Gateway from '#models/gateway'
import Product from '#models/product'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('Purchase', (group) => {

    group.each.setup(async () => {
        await User.firstOrCreate(
            {
                email: 'joao@bemobile.com'
            },
            {
                fullName: 'Joao',
                password: await hash.make('12345678'),
                role: 'admin'
            }
        )

        await Product.create({
            name: 'Notebook',
            amount: 15
        })

        await Gateway.create({
            name: 'Gateway1',
            isActive: true,
            priority: 1
        })
    })

    test('Should fail when product does not exist', async ({ client }) => {

        const response = await client.post('/purchase').json({
            productId: 999,
            quantity: 1,
            name: 'Joao',
            email: 'joao@bemobile.com',
            cardNumber: '1234000000001234',
            cvv: '123'
        })

        response.assertStatus(404)

    })

})