import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
	depends('admin:reports');

	const { supabase, session } = await parent();
	
	// Fetch students
	const { data: students } = await supabase.from('profiles')
		.select('*')
		.eq('role', 'student'); // Assuming there's a 'type' field that indicates the profile type

	// Fetch contractors
	const { data: contractors } = await supabase.from('profiles')
		.select('*')
		.eq('role', 'contractor'); // Assuming there's a 'type' field that indicates the profile type

	return { students, contractors };
}) satisfies PageLoad;
