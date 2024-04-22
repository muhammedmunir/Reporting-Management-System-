import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:reports');

	const { supabase, session } = await parent();
	const { data: reports } = await supabase.from('profiles').select(`*`).eq('role', 'contractor');

	return { reports };
}) satisfies PageLoad;
