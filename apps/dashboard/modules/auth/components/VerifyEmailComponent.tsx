"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { VerifyEmailSchema, type VerifyEmailInput } from "@themrktplace/schema"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
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

  const form = useForm({
    defaultValues: {
      token: token || "",
    } as VerifyEmailInput,
    validators: {
      onChange: VerifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      verifyEmail(value)
    },
  })

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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="token"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Verification Token</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter token manually"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className="w-full"
                type="submit"
                disabled={!canSubmit || isSubmitting || isPending}
              >
                {(isSubmitting || isPending) && (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                Verify Now
              </Button>
            )}
          />
        </form>
      )}
    </div>
  )
}
