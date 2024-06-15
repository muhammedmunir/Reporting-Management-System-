<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
  import Sectionwrapper from '../component/sectionwrapper.svelte';
  import Headers from '../component/header.svelte';

    export let data: PageData;
    const { supabase, session, claimedCoupons } = data;

    const handleUseCoupon = async (claimedCouponId: number, couponId: number) => {
        // Retrieve the coupon data from claimed_coupons before deletion
        const { data: couponData, error: fetchError } = await supabase
            .from('claimed_coupons')
            .select('*')
            .eq('id', claimedCouponId)
            .single();

        if (fetchError || !couponData) {
            console.error(fetchError);
            alert('Failed to retrieve coupon data');
            return;
        }

        // Insert the coupon data into history_claimed_coupons
        const { error: insertError } = await supabase
            .from('history_claimed_coupons')
            .insert({
                user_id: couponData.user_id,
                coupon_id: couponData.coupon_id,
                claimed_at: couponData.claimed_at,
            });

        if (insertError) {
            console.error(insertError);
            alert('Failed to save coupon to history');
            return;
        }

        // Delete the coupon from claimed_coupons
        const { error: deleteError } = await supabase
            .from('claimed_coupons')
            .delete()
            .eq('id', claimedCouponId);

        if (deleteError) {
            console.error(deleteError);
            alert('Failed to delete coupon');
            return;
        }

        alert('Coupon used successfully!');
        goto('/student/coupon', { replaceState: true });
    };

    const formatDate = (dateString: string) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kuala_Lumpur'
        };
        return new Date(dateString).toLocaleString('en-GB', options);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/login', { replaceState: true });
    };
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
        <h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Claimed Coupons</h2>
        <section class="min-h-screen flex flex-col px-4">
            <div class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {#each claimedCoupons as claimedCoupon}
                        {#if !claimedCoupon.used}
                            <div class="border p-4 rounded-lg shadow-sm hover:shadow-md">
                                <h3 class="font-semibold text-lg">{claimedCoupon.coupons.title}</h3>
                                <p class="mt-2">{formatDate(claimedCoupon.coupons.description)}</p>
                                <p class="mt-2">Price: RM{claimedCoupon.coupons.price.toFixed(2)}</p>
                                <p class="mt-2">Claimed at: {new Date(claimedCoupon.claimed_at).toLocaleString()}</p>
                                <button class="mt-4 px-4 py-2 rounded specialBtnDark hover:bg-red-900"
                                        on:click={() => handleUseCoupon(claimedCoupon.id, claimedCoupon.coupon_id)}>
                                    Use Coupon
                                </button>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </section>
    </div>
</Sectionwrapper>
