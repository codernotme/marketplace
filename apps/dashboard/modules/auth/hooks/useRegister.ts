import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RegisterInput } from '@themrktplace/schema'
import api from '@/lib/api'

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await api.post('/api/v1/auth/register', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Registration successful! Please check your email and phone for verification.')
      // In stage 1 onboarding flow, we should route them to verification steps.
      router.push(`/verify-email?token=${data.data.emailToken}`) // For demo/stage 1 testing simplicity we'll pass token if needed, or just route to verify screen
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Registration failed. Please check your details.')
    }
  })
}
