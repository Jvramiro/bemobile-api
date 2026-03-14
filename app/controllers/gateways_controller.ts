import Gateway from '#models/gateway'
import { setGatewayActiveValidator, updateGatewayPriorityValidator } from '#validators/gateway'
import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
    async setActive({ params, request, response }: HttpContext) {
        const gateway = await Gateway.findOrFail(params.id)
        const data = await request.validateUsing(setGatewayActiveValidator)
        gateway.isActive = data.is_active
        await gateway.save()
        return response.ok({
            message: `Gateway ${gateway.name} isActive set to ${gateway.isActive}`
        })
    }

    async updatePriority({ params, request, response }: HttpContext) {
        const gateway = await Gateway.findOrFail(params.id)
        const data = await request.validateUsing(updateGatewayPriorityValidator)
        gateway.priority = data.priority
        await gateway.save()
        return response.ok({
            message: `Gateway ${gateway.name} priority set to ${gateway.priority}`
        })
    }
}