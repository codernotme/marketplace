import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useProducts(options: { page?: number; pageSize?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      const { data } = await api.get('/products', { params: options })
      return data.data
    }
  })
}

export function useInventoryReport(storeId: string) {
  return useQuery({
    queryKey: ['reports', 'inventory', storeId],
    queryFn: async () => {
      const { data } = await api.get('/reports/inventory', { params: { storeId } })
      return data.data
    },
    enabled: !!storeId
  })
}
