import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export function useCurrentShift(storeId: string) {
  return useQuery({
    queryKey: ['shifts', 'current', storeId],
    queryFn: async () => {
      const { data } = await api.get(`/shifts/current/${storeId}`)
      return data.data
    },
    enabled: !!storeId
  })
}

export function useShiftActions(storeId: string) {
  const queryClient = useQueryClient()

  const openShift = useMutation({
    mutationFn: async (body: { openingCash: number; notes?: string }) => {
      const { data } = await api.post(`/shifts/open/${storeId}`, body)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      toast.success('Shift opened successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to open shift')
    }
  })

  const closeShift = useMutation({
    mutationFn: async (body: { closingCash: number; notes?: string }) => {
      const { data } = await api.post(`/shifts/close/${storeId}`, body)
      return data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      toast.success('Shift closed successfully')
      if (data.discrepancy !== 0) {
        toast.warning(`Cash discrepancy: ₹${data.discrepancy}`)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to close shift')
    }
  })

  return { openShift, closeShift }
}
