import { defineCollection, z } from 'astro:content'

const works = defineCollection({
	schema: z.object({
		title: z.string(),
		isDraft: z.boolean().default(false),
		pubDate: z.string().transform((str) => new Date(str)),
		year: z.number(),
		description: z.string(),
		client: z.object({
			name: z.string(),
			logo: z.string()
		}),
		business_niche: z.string(),
		deadline: z.string(),
		image: z
			.object({
				src: z.string(),
				alt: z.string().optional(),
				caption: z.string().optional()
			})
			.optional(),
		stacks: z.array(z.string()),
		languages: z.array(z.string()).optional(),
		review: z
			.object({
				author: z.string().optional(),
				avatar: z.string().optional(),
				message: z.string().optional()
			})
			.optional()
	})
})

export const collections = { works }
