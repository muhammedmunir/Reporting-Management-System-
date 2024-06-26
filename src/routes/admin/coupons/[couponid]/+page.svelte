<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from '../[couponid]/$types';
    import { writable } from 'svelte/store';
	import Sectionwrapper from '../../component/sectionwrapper.svelte';
    import Headers from '../../component/header.svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	let coupons = data.coupons;
	console.log(coupons);
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let description = '';
	let quantity = '';
	let price = '';

	let showSubmitConfirm = false;
	let couponIdToupdate: any = null;

	let showConfirmdelete = false;
	let couponIdToDelete: any = null;

	let errors = writable({
		description: '',
		quantity: '',
		price: ''
	});

	const validateForm = () => {
		let isValid = true;
		errors.set({
			description: '',
			quantity: '',
			price: ''
		});

		if (!description) {
			errors.update(e => ({ ...e, description: 'Food or drink is required' }));
			isValid = false;
		}
		if (!quantity) {
			errors.update(e => ({ ...e, quantity: 'Quantity is required' }));
			isValid = false;
		}
		if (!price) {
			errors.update(e => ({ ...e, price: 'Price is required' }));
			isValid = false;
		}

		return isValid;
	};

	function confirmupdate(id: any) {
		if (!validateForm()) {
				console.error('Form validation failed');
				return;
		}
		
		couponIdToupdate = id;
		showSubmitConfirm = true;
	};

	const updatecoupons = async () => {
		showSubmitConfirm = false;

		await supabase.from('coupons').update({ description, quantity, price }).eq('id', couponIdToupdate);
        goto('/admin/coupons');
	};

	function handlecoupondelete(id: any) {
		couponIdToDelete = id;
		showConfirmdelete = true;
	};

	const confirmdelete = async () => {
		try {
			showConfirmdelete = false;

			const { error } = await supabase.from('coupons').delete().eq('id', couponIdToDelete);

			if (error) {
				console.error('Error deleting coupon:', error.message);
			} else {
				console.log('Coupon deleted successfully');
				await invalidate('admin:coupons'); // Ensure invalidation completes before navigating
				console.log('Coupon invalidated');
				await goto('/admin/coupons'); // Await goto to ensure navigation happens
				console.log('Navigation to /admin/coupons triggered');
			}

			couponIdToDelete = null;
		} catch (err) {
			console.error('Unexpected error during coupon deletion:', err);
		}
	};
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Detail Coupon</h2>
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full" on:submit|preventDefault={() => confirmupdate(coupons.id)}>
			{#if coupons.title}
			<div class="mb-6">
				<label for="title" class="block text-gray-700 text-sm font-bold mb-2">Arked</label>
				<input
						disabled
						id="title"
						type="text"
						bind:value={coupons.title}
						class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
			</div>
			{/if}
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Food or Drink</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={description} value="Food" />
					Food
				</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={description} value="Drink" />
					Drink
				</label>
				{#if $errors.description}<p class="text-red-500 text-xs italic">{$errors.description}</p>{/if}
			</div>

			<div class="mb-6">
				<label for="quantity" class="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
				<input type="number" bind:value={quantity} name="quantity" placeholder="Quantity" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if $errors.quantity}<p class="text-red-500 text-xs italic">{$errors.quantity}</p>{/if}
			</div>

			<div class="mb-6">
				<label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price</label>
				<input type="number" step="0.01" bind:value={price} name="price" placeholder="Price" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if $errors.price}<p class="text-red-500 text-xs italic">{$errors.price}</p>{/if}
			</div>

			<div class="flex items-center justify-between">
				<button type="submit" class="px-4 py-2 mt-4 specialBtnDark rounded hover:bg-red-900">
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullfont-semibold">Submit</p>
				</button>
				<button on:click={() => handlecoupondelete(coupons.id)} class="specialBtn p-2">
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullfont-semibold">Delete</p>
				</button>
				<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/coupons">Cancel</a>
			</div>
		</form>
	</div>
</Sectionwrapper>

{#if showSubmitConfirm}
  <div class="modal">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure this change coupon?</p>
      <button on:click={updatecoupons} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
      <button on:click={() => (showSubmitConfirm = false)} class="specialBtn p-2 m-2 px-4 py-2 mt-4">No</button>
    </div>
  </div>
{/if}

{#if showConfirmdelete}
  <div class="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure you want to delete this coupon?</p>
      <button on:click={confirmdelete} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
      <button on:click={() => (showConfirmdelete = false)} class="specialBtn p-2 m-2 px-4 py-2 mt-4">No</button>
    </div>
  </div>
{/if}

<style>
	.modal {
		@apply fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75;
	}
</style>
