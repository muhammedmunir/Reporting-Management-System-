import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url, params, depends }) => {
	depends('student:reports'); // Assuming you need this dependency

	const { supabase } = await parent();

	// Fetch report data based on reportid
	const { data: reports, error } = await supabase
		.from('report_users_view')
		.select('*')
		.eq('report_id', params.detailreportid)
		.single();

	return { reports };
};
