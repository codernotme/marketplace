import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { UpdateTenantProfileInput, UpdateStoreInput } from '@themrktplace/schema'
import { toast } from 'sonner'

export function useSettings() {
  const queryClient = useQueryClient()

  const { data: tenant, isLoading: isLoadingTenant } = useQuery({
    queryKey: ['tenant-status'],
    queryFn: async () => {
      const { data } = await api.get('/tenants/status')
      return data.data
    }
  })

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateTenantProfileInput) => {
      const { data: response } = await api.patch('/tenants/profile', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-status'] })
      toast.success('Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update profile')
    }
  })

  const updateStore = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStoreInput }) => {
      const { data: response } = await api.patch(`/tenants/stores/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-status'] })
      toast.success('Store updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update store')
    }
  })

  return { 
    tenant, 
    isLoading: isLoadingTenant, 
    updateProfile, 
    updateStore 
  }
}
