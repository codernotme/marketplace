"use client"

import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { RegisterSchema, type RegisterInput } from "@themrktplace/schema"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { useRegister } from "../hooks/useRegister"
import Link from "next/link"

export function RegisterForm() {
  const { mutate: registerTenant, isPending } = useRegister()

  const form = useForm({
    defaultValues: {
      fullName: "",
      businessEmail: "",
      phoneNumber: "",
      businessName: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    } as z.input<typeof RegisterSchema>,
    validators: {
      onChange: RegisterSchema,
    },
    onSubmit: async ({ value }) => {
      registerTenant(value as RegisterInput)
    },
  })

  return (
    <div className="grid gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="fullName"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John Doe"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
          <form.Field
            name="businessName"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Business Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Acme Corp"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="businessEmail"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Business Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="john@acme.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
          <form.Field
            name="phoneNumber"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="9876543210"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    disabled={isPending}
                    aria-invalid={isInvalid}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )
            }}
          />
        </div>

        <form.Field
          name="termsAccepted"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                  <Checkbox
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                    disabled={isPending}
                  />
                  <div className="space-y-1 leading-none">
                    <FieldLabel htmlFor={field.name} className="text-sm font-normal text-muted-foreground">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>.
                    </FieldLabel>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                </div>
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
              Create Account
            </Button>
          )}
        />
      </form>
    </div>
  )
}
