const z = require('zod')

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
}).strict()

function validateAuth(input) {
  return authSchema.safeParse(input)
}

function validateAuthPartial(input) {
  return authSchema.partial().safeParse(input)
}

module.exports = { validateAuth, validateAuthPartial }
