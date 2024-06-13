import type { PageLoad } from './$types';

export const load = (async ({ parent, depends }) => {
  depends('contractor:');

  const { supabase, session } = await parent();
  const { data: claimedCoupons } = await supabase
    .from('claimed_coupons')
    .select(`*, coupons:coupon_id(*)`)
    .eq('user_id', session.user.id);

  return { claimedCoupons, session };
}) satisfies PageLoad;
