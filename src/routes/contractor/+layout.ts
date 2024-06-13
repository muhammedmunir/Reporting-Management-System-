// src/routes/admin/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
    const { supabase, session } = await parent();

    if (!session) {
        // Redirect to login if no session
        throw redirect(303, '/login');
    }

    const { data: user_profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        throw redirect(303, '/login');
    }

    if (user_profile.role === 'admin') {
        throw redirect(303, '/admin');
    }

    if (user_profile.role === 'student') {
        throw redirect(303, '/student');
    }

    return { user_profile };
}) satisfies LayoutLoad;
