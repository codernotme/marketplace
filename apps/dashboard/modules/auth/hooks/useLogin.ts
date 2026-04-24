import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { LoginInput } from '@themrktplace/schema'
import api from '@/lib/api'
import { useAuthStore } from '../store/authStore'

export function useLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('/api/v1/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.data.mfaRequired) {
        // Redirect to MFA verification screen
        router.push(`/mfa-verify?session=${data.data.mfaSessionToken}`)
        return
      }

      setAuth({
        accessToken: data.data.accessToken,
        user: data.data.user
      })

      toast.success('Login successful')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Login failed. Please check your credentials.')
    }
  })
}
