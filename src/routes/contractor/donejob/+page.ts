import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:reports');

	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('reports')
		.select(`*`)
		.not('status', 'eq', 'pending')
		.not('status', 'eq', 'rejected')
		.not('status', 'eq', 'search contractor')
		.not('status', 'eq', 'in progress')
		.order('updated_at', { ascending: false });

	return { reports };
}) satisfies PageLoad;
