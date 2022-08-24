import * as z from 'zod'

export const exerciseSchema = z.object({
  name: z.string(),
  reps: z.string().min(1),
  userId: z.string(),
  description: z.optional(z.string().min(4).max(240)),
  exerciseTemplateId: z.optional(z.string()),
  exerciseTemplateData: z.object({
    templateName: z.string(),
    templateSets: z.number(),
  })
})
