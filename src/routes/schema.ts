import { z } from 'zod';

export const formSchema = z.object({
	parent_name: z.string().min(2).max(50),
	relationship: z.string().min(2).max(50),
	number_meals: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
		message: 'Expected number, received a string'
	}),
	children: z
		.array(
			z.object({
				child_name: z.string().min(2).max(50),
				class: z.string().min(2).max(50)
			})
		)
		.default([{ child_name: '', class: '' }])
});

export type FormSchema = typeof formSchema;
