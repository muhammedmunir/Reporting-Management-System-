<script lang="ts">
	import type { PageData } from './$types.js';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let title = '';
	let description = '';
	let quantity = '';
	let price = '';

	let titleoption = [
		'CENGAL',
		'KTC',
		'KDSE',
		'LESTARI',
		'MERANTI',
		'PERDANA',
		'ANGKASA',
	];

	let errors = writable({
		title: '',
		description: '',
		quantity: '',
		price: ''
	});

	const validateForm = () => {
		let isValid = true;
		errors.set({
			title: '',
			description: '',
			quantity: '',
			price: ''
		});

		if (!title) {
			errors.update(e => ({ ...e, title: 'Arked is required' }));
			isValid = false;
		}
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

	const handleSubmit = async () => {
		if (!validateForm()) {
			console.error('Form validation failed');
			return;
		}

		const { data: insertedCoupon, error } = await supabase.from('coupons').insert([
			{
				title,
				description,
				quantity: parseInt(quantity),
				price: parseFloat(price)
			}
		]);

		if (error) {
			console.error('Error inserting coupon:', error.message);
			return;
		}

		console.log('Coupon created successfully:', insertedCoupon);
		goto('/admin/coupons');
	};
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Create Coupon</h2>
		<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
			<div class="mb-6">
				<label for="title" class="block text-gray-700 text-sm font-bold mb-2">Arked</label>
				<select bind:value={title} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
					{#each titleoption as value}
						<option value={value}>{value}</option>
					{/each}
				</select>
				{#if $errors.title}<p class="text-red-500 text-xs italic">{$errors.title}</p>{/if}
			</div>

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

			<button type="submit" class="px-4 py-2 mt-4 specialBtnDark rounded hover:bg-red-900">Create</button>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/coupons">Cancel</a>
		</form>
	</div>
</Sectionwrapper>