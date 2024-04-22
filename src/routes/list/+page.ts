import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase } = await parent();
	const { data: parents } = await supabase
		.from('meal_parent')
		.select(`*`)
		.order('created_at', { ascending: true });

	return { parents };
}) satisfies PageLoad;
