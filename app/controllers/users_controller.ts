import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
    async index({ response }: HttpContext) {
        const users = await User.all()
        return response.ok(users)
    }

    async store({ request, response }: HttpContext) {
        const data = request.only(['fullName', 'email', 'password', 'role'])
        data.password = await hash.make(data.password)
        const user = await User.create(data)
        return response.created({
            message: "User sucessfully created",
            data: user
        })
    }

    async update({ params, request, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['fullName', 'email', 'role'])
        user.merge(data)
        await user.save()
        return response.ok({
            message: 'User sucessfully updated',
            data: user
        })
    }

    async destroy({ params, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.ok({
            message: 'User sucessfully deleted'
        })
    }
}