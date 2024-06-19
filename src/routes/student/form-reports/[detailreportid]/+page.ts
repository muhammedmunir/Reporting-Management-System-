import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
    const { supabase } = await parent();

    // Fetch report data based on reportid
    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', params.detailreportid)
        .single();

    if (error) {
        console.error('Error fetching report:', error);
    }

    return { reports };
};
