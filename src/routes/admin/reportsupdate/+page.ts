import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:reports');

	const { supabase, session } = await parent();
	const { data: reports } = await supabase
		.from('report_users_view')
		.select(`*`)
		.not('status', 'eq', 'complete')
		.not('status', 'eq', 'pending')
		.not('status', 'eq', 'rejected')
		.order('created_at', { ascending: false });

	return { reports };
}) satisfies PageLoad;
