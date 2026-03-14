import vine from '@vinejs/vine'

export const setGatewayActiveValidator = vine.create({
  is_active: vine.boolean(),
})

export const updateGatewayPriorityValidator = vine.create({
  priority: vine.number().positive(),
})