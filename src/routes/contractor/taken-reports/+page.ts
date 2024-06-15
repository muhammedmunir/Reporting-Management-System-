import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:reports');

	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('reports')
		.select(`*`)
		.eq('status', 'in progress')
		.eq('handleby', session?.user.id)
		.order('created_at', { ascending: true });

	return { reports };
}) satisfies PageLoad;