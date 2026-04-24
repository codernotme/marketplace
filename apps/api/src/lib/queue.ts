import { Queue, Worker, Job } from 'bullmq'
import { redis } from './redis.js'

export const notificationQueue = new Queue('notifications', {
  connection: redis
})

export async function addNotificationJob(type: string, data: any) {
  await notificationQueue.add(type, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  })
}
