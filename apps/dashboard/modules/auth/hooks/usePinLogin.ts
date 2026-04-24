import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuthStore } from '../store/authStore'

export function usePinLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (data: { staffId: string; pin: string }) => {
      const response = await api.post('/api/v1/auth/pin-login', data)
      return response.data
    },
    onSuccess: (data) => {
      setAuth({
        accessToken: data.data.accessToken,
        user: data.data.user // This might be staff user or current device user? 
        // In backend, we returned { accessToken, staff }. Let's align.
      })

      toast.success(`Logged in as ${data.data.staff.employeeCode}`)
      router.push('/pos')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Invalid PIN')
    }
  })
}
