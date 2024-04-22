<script>
	import { goto, invalidateAll } from '$app/navigation';
	import logo1 from '$lib/img/logo1.png';

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
			errorMessage = 'No Email or Password';
		}
		loading = false;
	};
</script>

<svelte:head>
	<title>Login | KDSE Report Management System</title>
</svelte:head>
<div class="flex items-center justify-center h-screen">
	<div class="w-auto items-center flex flex-col justify-center">
		<img class="w-96" alt="school logo" src={logo1} />
		<h1 class="text-xl md:text-4xl font-extrabold mb-2">Welcome To</h1>
		<h1 class="text-xl md:text-4xl font-extrabold mb-10">KDSE Report Management System</h1>
		<h1 class="mb-10 text-md md:text-2xl font-semibold">Login to your account</h1>
		<form>
			<div class="form-control w-auto sm:w-80">
				<div class="label">
					<span class="label-text font-semibold">Email</span>
				</div>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="Type your email here"
					class="p-3 border border-gray-400 rounded-md w-full"
				/>
			</div>

			<div class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Password</span>
				</div>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="Type your password here"
					class="p-3 border border-gray-400 rounded-md w-full"
				/>
				<p class="mt-2 text-lg text-error">{errorMessage}</p>
			</div>

			<div class="pt-10">
				<button
					disabled={loading}
					on:click={handleSignIn}
					id="login-button"
					class="border border-orange-400 rounded-lg bg-orange-300 py-2 px-5 sm:px-20">Login</button
				>
			</div>
		</form>
	</div>
</div>
