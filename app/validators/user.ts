import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)
const role = () => vine.string().in(['admin', 'manager', 'finance', 'user'])
const fullName = () => vine.string().minLength(3).maxLength(100)

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
  fullName: fullName(),
  email: email(),
  password: password(),
  role: role().optional(),
})

export const updateUserValidator = vine.create({
  fullName: fullName().optional(),
  email: email().optional(),
  role: role().optional(),
})