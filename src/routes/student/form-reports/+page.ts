import { flip } from 'svelte/animate';
import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('student:reports');

	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('reports')
		.select(`*`)
		.eq('owner', session?.user.id)
		.order('updated_at', { ascending: false });

	return { reports };
}) satisfies PageLoad;
