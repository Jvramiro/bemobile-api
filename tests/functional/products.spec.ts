import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('Products', (group) => {

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
    })

    async function getToken(client: any){
        const login = await client.post('/login').json({
            email: 'joao@bemobile.com',
            password: '12345678'
        })

        return login.body().data.token
    }

    test('Should create a product successfully', async ({ client }) => {
        const token = await getToken(client)

        const response = await client.post('/products')
            .header('Authorization', `Bearer ${token}`)
            .json({
                name: 'Mouse',
                amount: 1
            })
        
        response.assertStatus(201)
    })

    test('Should list all products', async ({ client }) => {
        const token = await getToken(client)

        const response = await client.get('/products')
            .header('Authorization', `Bearer ${token}`)
        
        response.assertStatus(200)
    })

    test('Should update a product successfully', async ({ client }) => {
        const token = await getToken(client)

        const product = await client.post('/products')
            .header('Authorization', `Bearer ${token}`)
            .json({
                name: 'Keyboard',
                amount: 1
            })

        const product_id = product.body().data.id

        const response = await client.put(`/products/${product_id}`)
            .header('Authorization', `Bearer ${token}`)
            .json({
                name: 'Mousepad',
                amount: 2
            })

        response.assertStatus(200)
        response.assertBodyContains({ data: { name: 'Mousepad' } })
    })

    test('Should delete a product successfully', async ({ client }) => {
        const token = await getToken(client)

        const product = await client.post('/products')
            .header('Authorization', `Bearer ${token}`)
            .json({
                name: 'Monitor',
                amount: 1
            })

        const product_id = product.body().data.id

        const respose = await client.delete(`/products/${product_id}`)
            .header('Authorization', `Bearer ${token}`)

        respose.assertStatus(200)
    })

    test('Should fail when acessing products without token', async ({ client }) => {
        const response = await client.get('/products')
        response.assertStatus(401)
    })

})