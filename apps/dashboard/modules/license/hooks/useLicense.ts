import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useLicenses() {
  return useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      const { data } = await api.get('/license')
      return data.data
    }
  })
}

export function useActiveLicense() {
  const { data: licenses, isLoading } = useLicenses()
  
  const activeLicense = licenses?.find((l: any) => l.status === 'ACTIVE')
  
  return {
    license: activeLicense,
    isLoading,
    isExpired: activeLicense ? new Date(activeLicense.expiresAt) < new Date() : true,
    isInactive: !activeLicense || activeLicense.status === 'INACTIVE'
  }
}
