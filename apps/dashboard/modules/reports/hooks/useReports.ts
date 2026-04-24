import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useRevenueStats(range: 'day' | 'week' | 'month' = 'month') {
  return useQuery({
    queryKey: ['reports', 'revenue', range],
    queryFn: async () => {
      const { data } = await api.get('/reports/revenue', { params: { range } })
      return data.data
    }
  })
}

export function useInventoryReport() {
  return useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: async () => {
      const { data } = await api.get('/reports/inventory')
      return data.data
    }
  })
}
