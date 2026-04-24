import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { UpdateOnboardingInput } from '@themrktplace/schema'
import { toast } from 'sonner'

export function useOnboarding() {
  const queryClient = useQueryClient()

  const { data: status, isLoading } = useQuery({
    queryKey: ['tenant-status'],
    queryFn: async () => {
      const { data } = await api.get('/tenants/status')
      return data.data
    }
  })

  const updateProgress = useMutation({
    mutationFn: async (data: UpdateOnboardingInput) => {
      const { data: response } = await api.patch('/tenants/onboarding', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-status'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update progress')
    }
  })

  return { status, isLoading, updateProgress }
}
