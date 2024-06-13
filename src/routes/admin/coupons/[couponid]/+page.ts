import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url, params, depends }) => {
	depends('admin:coupons'); // Assuming you need this dependency

	const { supabase } = await parent();

	// Fetch report data based on reportid
	const { data: coupons, error } = await supabase
		.from('coupons')
		.select('*')
		.eq('id', params.couponid)
		.single();

	return { coupons };
};