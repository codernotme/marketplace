import Dexie, { type Table } from 'dexie'

export interface LocalCache {
  id?: number
  key: string
  value: any
  expiresAt: number
}

export class AppDatabase extends Dexie {
  cache!: Table<LocalCache>

  constructor() {
    super('TheMrktPlaceDB')
    this.version(1).stores({
      cache: '++id, key, expiresAt',
    })
  }
}

export const db = new AppDatabase()
