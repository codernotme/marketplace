import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useSales(options: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ['sales', options],
    queryFn: async () => {
      const { data } = await api.get('/sales', { params: options })
      return data.data
    }
  })
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      const { data } = await api.get(`/sales/${id}`)
      return data.data
    },
    enabled: !!id
  })
}
