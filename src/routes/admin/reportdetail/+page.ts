import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url, depends }) => {
    depends('admin:reports'); // Assuming you need this dependency

    const { supabase } = await parent();

    // Extract reportid from URL parameters
    const params = new URLSearchParams(url.search);
    const reportId = params.get('reportid');

    // Fetch report data based on reportid
    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

    return { reports };
};