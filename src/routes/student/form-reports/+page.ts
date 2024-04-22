import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('reports')
		.select(`*`)
		.eq('owner', session?.user.id)
		.order('created_at', { ascending: true });

	return { reports };
}) satisfies PageLoad;
