<script>
	import { goto, invalidateAll } from '$app/navigation';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Header from "../component/header.svelte";

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let email = '';
	let password = '';
	let errorMessage = '';
	let loading = false;

	const handleSignIn = async () => {
		if (email !== '' && password !== '') {
			loading = true;
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (!error) {
				errorMessage = '';
				const { data: user_info } = await supabase
					.from('profiles')
					.select('role')
					.eq('id', data.session.user.id)
					.single();
				invalidateAll().then(() => {
					goto(`/${user_info?.role || 'student'}`);
				});
			} else {
				errorMessage = error?.message;
			}
		} else {
			errorMessage = 'Please fill Email or Password';
		}
		loading = false;
	};
</script>

<Sectionwrapper>
	<Header />
	<div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Login</h2>
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div class="mb-6">
				<div class="label">
					<span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Email</span>
				</div>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="Type your email here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				/>
			</div>

			<div class="mb-6">
				<div class="label">
					<span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Password</span>
				</div>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="Type your password here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				/>
			</div>
			
			<p class="text-red-500 text-center text-xs italic">{errorMessage}</p>

			<div class="flex items-center justify-center">
				<button
					disabled={loading}
					on:click={handleSignIn}
					id="login-button"
					class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20">Login</button
				>
			</div>

			<div class="flex items-center justify-center">
				<a class="duration-200 hover:text-red-400 cursor-pointer py-2 px-4" href="/">Back</a>
			</div>
		</form>
	</div>
</Sectionwrapper>
