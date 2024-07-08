<script>
	import { goto, invalidateAll } from '$app/navigation';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Header from "../component/header.svelte";

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let matrikID = '';
	let full_name = '';
	let errorMessage = '';
	let loading = false;
	let role = 'student';
	let phone = '';
	let showPassword = false;
	let showConfirmPassword = false;

	let errors = {
		email: '',
		password: '',
		confirmPassword: '',
		username: '',
		matrikID: '',
		full_name: '',
		phone: ''
	};

	const validateForm = () => {
		let isValid = true;
		errors = {
			email: '',
			password: '',
			confirmPassword: '',
			username: '',
			matrikID: '',
			full_name: '',
			phone: ''
		};

		const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
		const uppercaseRegex = /[A-Z]/;
		const lowercaseRegex = /[a-z]/;
		const number = /[1234567890]/;

		if (!email) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!email.endsWith('@graduate.utm.my')) {
			errors.email = 'Email must end with @graduate.utm.my';
			isValid = false;
		}
		if (!password) {
			errors.password = 'Password type is required';
			isValid = false;
		} else if (password.length < 8) {
			errors.password = 'Password must be at least 8 characters';
			isValid = false;
		} else if (!symbolRegex.test(password)) {
			errors.password = 'Password must contain at least 1 symbol';
			isValid = false;
		} else if (!uppercaseRegex.test(password)) {
			errors.password = 'Password must contain at least 1 uppercase letter';
			isValid = false;
		} else if (!lowercaseRegex.test(password)) {
			errors.password = 'Password must contain at least 1 lowercase letter';
			isValid = false;
		} else if (!number.test(password)) {
			errors.password = 'Password must contain at least 1 number';
			isValid = false;
		}
		if (!confirmPassword) {
			errors.confirmPassword = 'Confirm Password is required';
			isValid = false;
		}
		if (!username) {
			errors.username = 'Username type is required';
			isValid = false;
		}
		if (!matrikID) {
			errors.matrikID = 'Matric is required';
			isValid = false;
		} else if (matrikID.length !== 9) {
			errors.matrikID = 'Matric ID must be 9 characters';
			isValid = false;
		}
		if (!full_name) {
			errors.full_name = 'Full Name type is required';
			isValid = false;
		}
		if (!phone) {
			errors.phone = 'Phone type is required';
			isValid = false;
		}
		return isValid;
	};

	const handleSignIn = async () => {

		if (!validateForm()) {
			console.error('Register validation failed');
			return;
		}

		if (email !== '' && password !== '' && confirmPassword !== '' && username !== '' && matrikID !== '' && full_name !== '' && phone !== '') {
			if (password !== confirmPassword) {
				errorMessage = 'Passwords do not match';
				return;
			}

			loading = true;

			// Check if email already exists
			const { data: existingUsers, error: checkError } = await supabase
				.from('profiles')
				.select('email')
				.eq('email', email);

			if (checkError) {
				errorMessage = checkError.message;
				loading = false;
				return;
			}

			if (existingUsers.length > 0) {
				errorMessage = 'Email already in use';
				loading = false;
				return;
			}

			const { data, error } = await supabase.auth.signUp({
				email,
				password
			});

			if (!error) {
				errorMessage = '';
				await supabase
					.from('profiles')
					.update({ username, full_name, matrikID, role, phone, email })
					// @ts-ignore
					.eq('id', data.user.id);
				alert('Please confirm your email before logging in.');
				goto('/login', { replaceState: true });
			} else {
				if (error.status === 429) {
						errorMessage = 'Rate limit exceeded. Please try again later.';
				} else {
					errorMessage = error.message;
				}
			}
		} else {
			errorMessage = 'Please fill all fields';
		}
		loading = false;
	};
</script>

<Sectionwrapper>
	<Header />
	<div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Student Register</h2>
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="xxxx@graduate.utm.my"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				{#if errors.email}<p class="text-red-500 text-xs italic">{errors.email}</p>{/if}
			</div>

			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="username">Username</label>
				<input
					id="username"
					bind:value={username}
					placeholder="Your username here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				{#if errors.username}<p class="text-red-500 text-xs italic">{errors.username}</p>{/if}
			</div>

			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="full_name">Full Name</label>
				<input
					id="full_name"
					bind:value={full_name}
					placeholder="Your Full Name here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				{#if errors.full_name}<p class="text-red-500 text-xs italic">{errors.full_name}</p>{/if}
			</div>

			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="matrikID">No. Matric</label>
				<input
					id="matrikID"
					bind:value={matrikID}
					placeholder="Your No. Matrik here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				{#if errors.matrikID}<p class="text-red-500 text-xs italic">{errors.matrikID}</p>{/if}
			</div>

			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="phone">No. Phone</label>
				<input
					id="phone"
					bind:value={phone}
					placeholder="Your No. Phone here"
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				{#if errors.phone}<p class="text-red-500 text-xs italic">{errors.phone}</p>{/if}
			</div>

			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="password">Password</label>
				<div class="relative">
					{#if showPassword}
						<input
							type="text"
							id="password"
							bind:value={password}
							placeholder="Your password here"
							class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					{:else}
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Your password here"
							class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					{/if}
					<div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="absolute inset-y-0 right-0 px-3 py-2 cursor-pointer" on:click={() => (showPassword = !showPassword)}>
							{#if showPassword}
								<span class="fa-solid fa-eye"></span> <!-- Font Awesome icon for show -->
							{:else}
								<span class="fa-solid fa-eye-slash"></span> <!-- Font Awesome icon for hide -->
							{/if}
						</div>
					</div>
				</div>
				{#if errors.password}<p class="text-red-500 text-xs italic">{errors.password}</p>{/if}
			</div>

			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]" for="confirmPassword">Confirm Password</label>
				<div class="relative">
					{#if showConfirmPassword}
						<input
							type="text"
							id="password"
							bind:value={confirmPassword}
							placeholder="Your password here"
							class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					{:else}
						<input
							type="password"
							id="password"
							bind:value={confirmPassword}
							placeholder="Your password here"
							class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					{/if}
					<div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="absolute inset-y-0 right-0 px-3 py-2 cursor-pointer" on:click={() => (showConfirmPassword = !showConfirmPassword)}>
							{#if showConfirmPassword}
								<span class="fa-solid fa-eye"></span>
							{:else}
								<span class="fa-solid fa-eye-slash"></span>
							{/if}
						</div>
					</div>
				</div>
				{#if errors.confirmPassword}<p class="text-red-500 text-xs italic">{errors.confirmPassword}</p>{/if}
			</div>

			<p class="text-red-500 text-center text-xs italic">{errorMessage}</p>

			<div class="flex items-center justify-center">
				<button
					disabled={loading}
					on:click={handleSignIn}
					id="login-button"
					class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20"
					>Register</button
				>
			</div>

			<div class="flex items-center justify-center">
				<a class="duration-200 hover:text-red-400 cursor-pointer py-2 px-4" href="/">Back</a>
			</div>
		</form>
	</div>
</Sectionwrapper>