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
	let role = 'student';

	const handleSignIn = async () => {
		if (email !== '' && password !== '' && username !== '' && matrikID !== '' && full_name !== '') {
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
				goto('/student');
			} else {
				errorMessage = error?.message;
			}
		} else {
			errorMessage = 'Please fill all';
		}
		loading = false;
	};
</script>

<main class="register flex flex-col justify-center items-center">
	<!--<div class="w-auto items-center flex flex-col justify-center">
		<h1 class="text-xl md:text-4xl font-extrabold mb-10">KDSE Report Management System</h1>
		<h1 class="text-xl md:text-4xl font-extrabold mb-10">Student Register Page</h1>
		<h1 class="mb-10 text-md md:text-2xl font-semibold">Register your account</h1>-->
		<h1 class="text-3xl font-bold mb-2">Student Register</h1>
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div class="mb-6">
				<div class="label">
					<span class="block text-gray-700 text-sm font-bold mb-2">Email</span>
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
					<span class="block text-gray-700 text-sm font-bold mb-2">Password</span>
				</div>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="Type your password here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				/>
			</div>

			<div class="mb-6">
				<div class="label">
					<span class="block text-gray-700 text-sm font-bold mb-2">Username</span>
				</div>
				<input
					bind:value={username}
					placeholder="Type your username here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				/>
			</div>

			<div class="mb-6">
				<div class="label">
					<span class="block text-gray-700 text-sm font-bold mb-2">Full Name</span>
				</div>
				<input
					bind:value={full_name}
					placeholder="Type your Full Name here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				/>
			</div>

			<div class="mb-6">
				<div class="label">
					<span class="block text-gray-700 text-sm font-bold mb-2">Kad Matrik</span>
				</div>
				<input
					bind:value={matrikID}
					placeholder="Type your Kad Matrik here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				/>

				<p class="text-center mt-2 text-lg text-error text-red-600">{errorMessage}</p>
			</div>

			<div class="flex items-center justify-center">
				<button
					disabled={loading}
					on:click={handleSignIn}
					id="login-button"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none sm:px-20"
					>Register</button
				>
			</div>

			<div class="flex items-center justify-center">
				<a class="duration-200 hover:text-indigo-400 cursor-pointer py-2 px-4" href="/">Back</a>
			</div>
		</form>
	<!--</div>-->
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <dev class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <slot/>
    </dev>
</section>