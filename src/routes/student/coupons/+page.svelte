<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
  
    export let data: PageData;
    const { supabase, session, coupons, userProfile } = data;
  
    let selectedQuantities = new Map<number, number>();
  
    const claimCoupon = async (couponId: number, couponQuantity: number) => {
      const selectedQuantity = selectedQuantities.get(couponId) || 0;
  
      if (userProfile.points < 100 * selectedQuantity) {
        alert('Not enough points');
        return;
      }
  
      if (couponQuantity < selectedQuantity) {
        alert('Not enough coupon stock');
        return;
      }
  
      const { error } = await supabase
        .from('claimed_coupons')
        .insert([...Array(selectedQuantity)].map(() => ({ user_id: session.user.id, coupon_id: couponId })));
  
      if (error) {
        console.error(error);
        alert('Failed to claim coupon');
        return;
      }
  
      await supabase
        .from('profiles')
        .update({ points: userProfile.points - 100 * selectedQuantity })
        .eq('id', session.user.id);
  
      await supabase
        .from('coupons')
        .update({ quantity: couponQuantity - selectedQuantity })
        .eq('id', couponId);
  
      alert('Coupon claimed successfully!');
      goto('/student/coupon');
    };
  
    const handleQuantityChange = (couponId: number, quantity: number) => {
      selectedQuantities.set(couponId, quantity);
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
        <h2 class="text-2xl font-bold mb-6">Available Coupons</h2>
        <p class="mb-4">Your Points: {userProfile.points}</p>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each coupons as coupon}
            <div class="border p-4 rounded-lg shadow-sm hover:shadow-md">
                <h3 class="font-semibold text-lg">{coupon.title}</h3>
                <p class="mt-2">{coupon.description}</p>
                <p class="mt-2">Quantity available: {coupon.quantity}</p>
                <input type="number" min="1" max={coupon.quantity} value={selectedQuantities.get(coupon.id) || 1}
                        on:input={(e) => handleQuantityChange(coupon.id, parseInt(e.target.value))} 
                        class="mt-2 border p-1 rounded"/>
                <button class="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400"
                        on:click={() => claimCoupon(coupon.id, coupon.quantity)}
                        disabled={coupon.quantity <= 0}>
                Claim for 100 Points Each
                </button>
            </div>
            {/each}
        </div>
        </div>
    </section>
</main>
