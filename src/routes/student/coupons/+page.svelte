<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import Sectionwrapper from '../component/sectionwrapper.svelte';
  import Headers from '../component/header.svelte';
  
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
</script>

<Sectionwrapper>
  <Headers { data } />
  <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
    <h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Available Coupons</h2>
    <section class="min-h-screen flex flex-col px-4 w-full">
        <div class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <p class="mb-4 text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Your Points: {userProfile.points}</p>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each coupons as coupon}
            <div class="border p-4 rounded-lg shadow-sm hover:shadow-md">
                <h3 class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold text-lg">{coupon.title}</h3>
                <p class="mt-2 text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">{coupon.description}</p>
                <p class="mt-2 text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">Quantity available: {coupon.quantity}</p>
                <input type="number" min="1" max={coupon.quantity} value={selectedQuantities.get(coupon.id) || 1}
                        on:input={(e) => handleQuantityChange(coupon.id, parseInt(e.target.value))} 
                        class="mt-2 border p-1 rounded"/>
                <button class="mt-4 px-4 py-2 rounded specialBtnDark hover:bg-red-900"
                        on:click={() => claimCoupon(coupon.id, coupon.quantity)}
                        disabled={coupon.quantity <= 0}>
                Claim for 100 Points Each
                </button>
            </div>
            {/each}
        </div>
        </div>
    </section>
  </div>
</Sectionwrapper>