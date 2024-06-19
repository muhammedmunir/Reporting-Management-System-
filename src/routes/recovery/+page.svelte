<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Header from "../component/header.svelte";

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let loading = false;
	let email = '';
	let token = '';
	let successMessage = '';
	let errorMessage = '';

	const handleResetPass = async () => {
		if (!email || email === '') {
			errorMessage = 'Please enter email';
			return;
		}
		errorMessage = '';
		loading = true;

		const { error } = await supabase.auth.resetPasswordForEmail(email);
		if (error) {
			errorMessage = error.message;
		} else {
			successMessage = 'OTP has been sent to your email!';
		}

		loading = false;
	};

	const handleSendToken = async () => {
		loading = true;
		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
		if (!error) {
			goto('/update-password');
		} else {
			errorMessage = error.message;
		}
		loading = false;
	};
</script>

<Sectionwrapper>
	<Header />
	<div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Forget Password</h2>
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<!-- Show email input first -->
			{#if successMessage === ''}
				<div class="mb-6">
					<div class="label">
						<span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Your Email</span>
					</div>
					<input
						type="email"
						bind:value={email}
						placeholder="example@email.com"
						class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
					/>
				</div>
			{/if}

			<!-- Display success message and OTP input field after sending email -->
			{#if successMessage !== ''}
				<p class="mt-2 text-sm font-bold text-success-content bg-base-200 p-3 rounded-xl duration-75">
					{successMessage}
				</p>
				<div class="mb-6">
					<div class="label">
						<span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Your OTP</span>
					</div>
					<input
						type="text"
						bind:value={token}
						placeholder="XXXXXX"
						class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
					/>
				</div>
			{/if}

			{#if errorMessage !== ''}
				<p
					class=" text-center mt-2 text-sm font-bold text-error border border-solid border-error-content p-3 rounded-xl text-red-700"
				>
					{errorMessage}
				</p>
			{/if}

			{#if successMessage === ''}
				<div class="flex items-center justify-center w-full">
					<button disabled={loading} on:click={handleResetPass} class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none w-full"
						>Send OTP</button
					>
				</div>
			{:else}
				<div class="flex items-center justify-center w-full mb-2">
					<button disabled={loading} on:click={handleSendToken} class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none w-full"
						>Verify OTP</button
					>
				</div>
				<div class="flex items-center justify-center w-full">
					{#if errorMessage !== ''}
						<button
							on:click={() => {
								errorMessage = '';
								email = '';
								successMessage = '';
							}}
							class="specialBtn py-2 px-4 rounded focus:outline-none w-full">Re-enter Email</button
						>
					{/if}
				</div>
			{/if}

			<div class="pt-3">
				<a href="/login" class="duration-200 hover:text-red-400 cursor-pointer py-2 px-4">Remembered your password?</a>
			</div>
		</form>
	</div>
</Sectionwrapper>