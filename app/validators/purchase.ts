import vine from '@vinejs/vine'

export const createPurchaseValidator = vine.create({
  productId: vine.number().positive(),
  quantity: vine.number().positive(),
  name: vine.string().minLength(2).maxLength(100),
  email: vine.string().email(),
  cardNumber: vine.string().minLength(16).maxLength(16),
  cvv: vine.string().minLength(3).maxLength(4),
})