import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('Transactions', (group) => {
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

    async function getToken(client: any) {
        const login = await client.post('/login').json({
            email: 'joao@bemobile.com',
            password: '12345678'
        })

        return login.body().data.token
    }

    test('Should list all transactions', async ({ client }) => {
        const token = await getToken(client)

        const response = await client.get('/transactions')
            .header('Authorization', `Bearer ${token}`)
        
        response.assertStatus(200)
    })

    test('Should fail when accessing transactions without token', async ({ client }) => {
        const response = await client.get('/transactions')
        response.assertStatus(401)
    })

    test('Should fail when transaction does not exist', async ({ client }) => {
        const token = await getToken(client)

        const response = await client.get('/transactions/123')
            .header('Authorization', `Bearer ${token}`)

        response.assertStatus(404)
    })
})