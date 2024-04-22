<script>
	import { goto, invalidateAll } from '$app/navigation';
	import logo1 from '$lib/img/logo1.png';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let email = '';
	let password = '';
	let username = '';
	let matrikID = '';
	let full_name = '';
	let errorMessage = '';
	let loading = false;
	let role = 'contractor';

	const handleSignIn = async () => {
		if (email !== '' && password !== '') {
			loading = true;
			const { data, error } = await supabase.auth.signUp({
				email,
				password
			});
			if (!error) {
				errorMessage = '';
				await supabase
					.from('profiles')
					.update({ username, full_name, matrikID, role })
					.eq('id', data.session?.user.id);
				goto(`/${role}`);
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
	<title>Register | KDSE Report Management System</title>
</svelte:head>
<div class="flex items-center justify-center h-screen">
	<div class="w-auto items-center flex flex-col justify-center">
		<h1 class="text-xl md:text-4xl font-extrabold mb-10">KDSE Report Management System</h1>
		<h1 class="text-xl md:text-4xl font-extrabold mb-10">Student Register Page</h1>
		<h1 class="mb-10 text-md md:text-2xl font-semibold">Register as Contractor</h1>
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

			<div class="form-control w-auto sm:w-80">
				<div class="label">
					<span class="label-text font-semibold">Username</span>
				</div>
				<input
					bind:value={username}
					placeholder="Type your username here"
					class="p-3 border border-gray-400 rounded-md w-full"
				/>
			</div>

			<div class="form-control w-auto sm:w-80">
				<div class="label">
					<span class="label-text font-semibold">Full Name</span>
				</div>
				<input
					bind:value={full_name}
					placeholder="Type your Full Name here"
					class="p-3 border border-gray-400 rounded-md w-full"
				/>
			</div>

			<div class="form-control w-auto sm:w-80">
				<div class="label">
					<span class="label-text font-semibold">Staff ID</span>
				</div>
				<input
					bind:value={matrikID}
					placeholder="Type your Kad Matrik here"
					class="p-3 border border-gray-400 rounded-md w-full"
				/>
			</div>

			<div class="pt-10">
				<button
					disabled={loading}
					on:click={handleSignIn}
					id="login-button"
					class="border border-orange-400 rounded-lg bg-orange-300 py-2 px-5 sm:px-20"
					>Register</button
				>
			</div>
		</form>
	</div>
</div>
