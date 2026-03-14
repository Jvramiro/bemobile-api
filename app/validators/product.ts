import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  name: vine.string().minLength(2).maxLength(100),
  amount: vine.number().positive(),
})

export const updateProductValidator = vine.create({
  name: vine.string().minLength(2).maxLength(100).optional(),
  amount: vine.number().positive().optional(),
})