import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useStaffList() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data } = await api.get('/staff')
      return data.data
    }
  })
}

export function useStaffCommissions() {
  return useQuery({
    queryKey: ['staff', 'commissions'],
    queryFn: async () => {
      const { data } = await api.get('/reports/commissions') // We'll need this endpoint
      return data.data
    }
  })
}
