import type { PageLoad } from './$types';

export const load = (async ({ parent, depends }) => {
  depends('admin:coupons');

  const { supabase, session } = await parent();
  const { data: coupons } = await supabase
    .from('coupons')
    .select(`*`);
  
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', session.user.id)
    .single();

  return { coupons, session, userProfile };
}) satisfies PageLoad;
