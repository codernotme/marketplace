import { useEffect } from 'react'
import { db } from '@/lib/db'
import api from '@/lib/api'
import { toast } from 'sonner'

export function useSync() {
  const syncPendingSales = async () => {
    const pending = await db.pendingSales.where('synced').equals(0).toArray()
    
    if (pending.length === 0) return

    for (const sale of pending) {
      try {
        await api.post('/sales', sale.data)
        await db.pendingSales.update(sale.id!, { synced: 1 })
      } catch (error) {
        console.error('Failed to sync sale:', error)
        // Keep in queue for next retry
      }
    }
    
    const count = await db.pendingSales.where('synced').equals(1).count()
    if (count > 0) {
      toast.success(`Successfully synced ${count} pending sales`)
      // Clean up synced sales
      await db.pendingSales.where('synced').equals(1).delete()
    }
  }

  const syncProducts = async () => {
    try {
      const { data } = await api.get('/products?pageSize=1000')
      const products = data.data.items.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        taxRateId: p.taxRateId,
        category: p.category?.name || 'Uncategorized',
        variants: p.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          price: Number(v.price),
          stock: 0 // We'll need a separate stock sync or live check
        }))
      }))
      
      await db.products.clear()
      await db.products.bulkAdd(products)
    } catch (error) {
      console.error('Failed to sync products:', error)
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      toast.info('Back online. Syncing pending sales...')
      syncPendingSales()
    }

    window.addEventListener('online', handleOnline)
    
    // Initial sync
    if (navigator.onLine) {
      syncPendingSales()
    }

    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return { syncPendingSales, syncProducts }
}
