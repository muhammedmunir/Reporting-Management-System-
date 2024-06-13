import type { PageLoad } from './$types';

export const load = (async ({ parent, url, depends }) => {
    const { supabase, session } = await parent();
    depends('admin:/admin');
    // Fetch user profile
    const { data: user_profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

    // Fetch reports
    const { data: reports } = await supabase
        .from('reports')
        .select('status');

    // Calculate totals for each status
    const statusCounts = {
        pending: 0,
        'search contractor': 0,
        'in progress': 0,
        'done progress': 0,
        complete: 0,
    };

    reports?.forEach((report) => {
        if (report.status in statusCounts) {
            statusCounts[report.status]++;
        }
    });

    // Fetch apply_contractor
    const { data: contractors } = await supabase
        .from('apply_contractor')
        .select('*');

    // Fetch claimed_coupons with user and coupon details
    const { data: claimed_coupons } = await supabase
        .from('claimed_coupons')
        .select('id, claimed_at, profiles(username), coupons(title, description)')
        .order('claimed_at', { ascending: false });

    return { user_profile, reports, statusCounts, contractors, claimed_coupons };
}) satisfies PageLoad;
