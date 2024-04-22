import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('role', 'contractor')
		.order('points', { ascending: false });

	return { reports };
}) satisfies PageLoad;
