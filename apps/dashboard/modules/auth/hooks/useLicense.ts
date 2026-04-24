import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface LicenseStatus {
  active: boolean
  plan: 'Basic' | 'Premium' | 'Enterprise'
  expiresAt: string
  modules: string[]
}

export function useLicense() {
  return useQuery<LicenseStatus>({
    queryKey: ['license-status'],
    queryFn: async () => {
      const response = await api.get('/api/v1/licenses/status')
      return response.data.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export async function provisionTenant(onboardingData: any) {
  const response = await api.post('/api/v1/onboarding/provision', onboardingData)
  return response.data
}
