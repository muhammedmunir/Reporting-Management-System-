import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(formSchema));

		let data = form.data as any;
		function mulberry32(seed) {
			return function () {
				var t = (seed += 0x6d2b79f5);
				t = Math.imul(t ^ (t >>> 15), t | 1);
				t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		}

		function djb2Hash(str) {
			let hash = 5381;
			for (let i = 0; i < str.length; i++) {
				hash = (hash * 33) ^ str.charCodeAt(i);
			}
			return hash >>> 0; // Ensure unsigned 32-bit integer
		}

		// Generate Unique ID using Mulberry32
		function generateUniqueID(input) {
			const seed = djb2Hash(input); // You'll need to implement a suitable hash function here
			const random = mulberry32(seed);
			return random().toString(36).slice(2, 11); // Generate a 9-character unique ID
		}

		data.qrcode = generateUniqueID(
			data?.parent_name + data?.children[0]?.child_name + new Date().toISOString().slice(20, 23)
		);
		const { error } = await supabase.from('meal_parent').insert(data);

		throw redirect(303, `/success?qrcode=${data.qrcode}`);
	}
};
