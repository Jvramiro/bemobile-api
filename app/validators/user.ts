import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

export const createUserValidator = vine.create({
  fullName: vine.string().minLength(3).maxLength(100),
  email: vine.string().email(),
  password: vine.string().minLength(8),
  role: vine.string().in(['admin', 'manager', 'finance', 'user']).optional(),
})

export const updateUserValidator = vine.create({
  fullName: vine.string().minLength(3).maxLength(100).optional(),
  email: vine.string().email().optional(),
  role: vine.string().in(['admin', 'manager', 'finance', 'user']).optional(),
})