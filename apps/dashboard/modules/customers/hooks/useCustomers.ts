import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export function useCustomers(options: { page?: number; pageSize?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['customers', options],
    queryFn: async () => {
      const { data } = await api.get('/customers', { params: options })
      return data.data
    }
  })
}

export function useCustomerActions() {
  const queryClient = useQueryClient()

  const createCustomer = useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.post('/customers', body)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create customer')
    }
  })

  return { createCustomer }
}
