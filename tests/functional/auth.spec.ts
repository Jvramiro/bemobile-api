import { test } from "@japa/runner";

test.group('Auth', () => {

    test('Should register and login successfully', async ({ client }) => {

        await client.post('/register').json({
            fullName: 'Joao',
            email: 'joao@bemobile.com',
            password: '12345678',
            passwordConfirmation: '12345678'
        })

        const response = await client.post('/login').json({
            email: 'joao@bemobile.com',
            password: '12345678'
        })

        response.assertStatus(200)
        response.assertBodyContains({ data: { token: response.body().data.token } })

    })

    test('Should return 400 when password is incorrect', async({ client }) => {

        const response = await client.post('/login').json({
            email: 'joao@bemobile.com',
            password: 'wrong'
        })

        response.assertStatus(400)

    })
})