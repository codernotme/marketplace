import Dexie, { type EntityTable } from 'dexie'

export interface LocalProduct {
  id: string
  name: string
  description?: string
  imageUrl?: string
  taxRateId: string
  category: string
  variants: LocalVariant[]
}

export interface LocalVariant {
  id: string
  sku: string
  price: number
  stock: number
}

export interface LocalCustomer {
  id: string
  name: string
  phone?: string
  email?: string
  loyaltyPoints: number
}

export interface PendingSale {
  id?: number
  data: any // The createSale request body
  timestamp: number
  synced: number // 0 or 1
}

class POSDatabase extends Dexie {
  products!: EntityTable<LocalProduct, 'id'>
  customers!: EntityTable<LocalCustomer, 'id'>
  pendingSales!: EntityTable<PendingSale, 'id'>

  constructor() {
    super('POSDatabase')
    this.version(1).stores({
      products: 'id, name, category',
      customers: 'id, name, phone',
      pendingSales: '++id, timestamp, synced'
    })
  }
}

export const db = new POSDatabase()
