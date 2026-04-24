import { Queue } from 'bullmq'
import { redis } from './redis.js'

const connection = redis

export const emailQueue = new Queue('email', { connection })
export const reportQueue = new Queue('reports', { connection })
export const inventoryQueue = new Queue('inventory-sync', { connection })
