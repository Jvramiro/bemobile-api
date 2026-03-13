import Gateway from '#models/gateway'
import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
    async setActive({ params, request, response }: HttpContext) {
        const gateway = await Gateway.findOrFail(params.id)
        gateway.isActive = request.input('is_active')
        await gateway.save()
        return response.ok({
            message: `Gateway ${gateway.name} isActive set to ${gateway.isActive}`
        })
    }

    async updatePriority({ params, request, response }: HttpContext) {
        const gateway = await Gateway.findOrFail(params.id)
        gateway.priority = request.input('priority')
        await gateway.save()
        return response.ok({
            message: `Gateway ${gateway.name} priority set to ${gateway.priority}`
        })
    }
}