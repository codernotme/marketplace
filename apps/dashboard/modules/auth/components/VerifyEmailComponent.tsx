"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VerifyEmailSchema, type VerifyEmailInput } from "@themrktplace/schema"
import { Button } from "@workspace/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api'

export function VerifyEmailComponent({ token }: { token?: string }) {
  const router = useRouter()

  const { mutate: verifyEmail, isPending } = useMutation({
    mutationFn: async (data: VerifyEmailInput) => {
      const response = await api.post('/api/v1/auth/verify-email', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Email verified successfully.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Verification failed. Invalid or expired token.')
    }
  })

  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      token: token || "",
    },
  })

  function onSubmit(values: VerifyEmailInput) {
    verifyEmail(values)
  }

  // Auto-submit if token is provided in URL
  React.useEffect(() => {
    if (token) {
      verifyEmail({ token })
    }
  }, [token, verifyEmail])

  return (
    <div className="grid gap-6">
      {token ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying your secure token...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter token manually" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending && <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />}
              Verify Now
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
