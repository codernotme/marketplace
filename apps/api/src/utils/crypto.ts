import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

export function encrypt(text: string): string {
  const secret = process.env['APP_SECRET']
  if (!secret || secret.length < 32) {
    throw new Error('APP_SECRET must be at least 32 characters long')
  }

  const iv = crypto.randomBytes(IV_LENGTH)
  const key = crypto.scryptSync(secret, 'salt', 32)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decrypt(encryptedData: string): string {
  const secret = process.env['APP_SECRET']
  if (!secret || secret.length < 32) {
    throw new Error('APP_SECRET must be at least 32 characters long')
  }

  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':')
  if (!ivHex || !authTagHex || !encryptedText) {
    throw new Error('Invalid encrypted data format')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const key = crypto.scryptSync(secret, 'salt', 32)
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
