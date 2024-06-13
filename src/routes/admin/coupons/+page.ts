import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:coupons');

	const { supabase, session } = await parent();
	const { data: coupons } = await supabase
		.from('coupons')
		.select(`*`)
		.order('title', { ascending: true });

	return { coupons };
}) satisfies PageLoad;