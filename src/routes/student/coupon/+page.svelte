<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';

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
  
<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/student">
            <h1 class="font-semibold">UTM<span class="text-indigo-400">Complaint</span></h1>
        </a>
        <button class="md:hidden grid place-items-center">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav class="md:flex items-center gap-4 lg:gap-6">
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/report-form">Make Report</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/form-reports">View Reports</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/ranking">View Ranking</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/coupons">Shop Coupon</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/coupon">My Coupon</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/profile">Profile</a>
            <button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<main class="register flex flex-col justify-center items-center">
    <section class="min-h-screen flex flex-col px-4">
        <div class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
            <h2 class="text-2xl font-bold mb-6">Claimed Coupons</h2>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each claimedCoupons as claimedCoupon}
                    {#if !claimedCoupon.used}
                        <div class="border p-4 rounded-lg shadow-sm hover:shadow-md">
                            <h3 class="font-semibold text-lg">{claimedCoupon.coupons.title}</h3>
                            <p class="mt-2">{formatDate(claimedCoupon.coupons.description)}</p>
                            <p class="mt-2">Price: RM{claimedCoupon.coupons.price.toFixed(2)}</p>
                            <p class="mt-2">Claimed at: {new Date(claimedCoupon.claimed_at).toLocaleString()}</p>
                            <button class="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400"
                                    on:click={() => handleUseCoupon(claimedCoupon.id, claimedCoupon.coupon_id)}>
                                Use Coupon
                            </button>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </section>
</main>
