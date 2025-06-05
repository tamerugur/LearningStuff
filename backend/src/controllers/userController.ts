import { Request, Response } from 'express'
import { registerSchema } from '@shared/schemas/userSchema'
import { UserModel } from '../models/userModel'
import bcrypt from 'bcrypt'

export async function registerUser(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() })
  }

  const { email, tcId, username, fullName, password } = parsed.data

  const [existingEmail, existingTcId, existingUsername] = await Promise.all([
    UserModel.findByEmail(email),
    UserModel.findByTcId(tcId),
    UserModel.findByUsername(username),
  ])

  if (existingEmail || existingTcId || existingUsername) {
    return res.status(400).json({
      error: 'Email, TC ID, or username already exists',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await UserModel.create({
    email,
    tcId,
    username,
    fullName,
    password: hashedPassword,
  })

  return res.status(201).json({ message: 'User registered successfully' })
}

export async function checkUnique(req: Request, res: Response) {
  const { field, value } = req.body

  if (!['email', 'tcId', 'username'].includes(field)) {
    return res.status(400).json({ error: 'Invalid field type' })
  }

  let exists = false
  if (field === 'email') exists = !!(await UserModel.findByEmail(value))
  if (field === 'tcId') exists = !!(await UserModel.findByTcId(value))
  if (field === 'username') exists = !!(await UserModel.findByUsername(value))

  return res.json({ exists })
}