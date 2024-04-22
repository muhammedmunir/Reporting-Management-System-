import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase, session } = await parent();

	if (!session) {
		redirect(303, '/');
	}

	return {};
}) satisfies PageLoad;
