import { z } from 'zod'

export const OpenShiftSchema = z.object({
  openingCash: z.number().min(0),
  notes: z.string().optional()
})

export const CloseShiftSchema = z.object({
  closingCash: z.number().min(0),
  notes: z.string().optional()
})

export type OpenShiftInput = z.infer<typeof OpenShiftSchema>
export type CloseShiftInput = z.infer<typeof CloseShiftSchema>
