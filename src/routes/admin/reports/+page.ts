import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:reports');

	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('reports')
		.select(`*`)
		.not('status', 'eq', 'complete')
		.not('status', 'eq', 'search contractor')
		.not('status', 'eq', 'in progress')
		.not('status', 'eq', 'rejected')
		.not('status', 'eq', 'done progress')
		.order('created_at', { ascending: false });

	return { reports };
}) satisfies PageLoad;
