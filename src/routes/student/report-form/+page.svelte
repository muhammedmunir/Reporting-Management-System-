<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types.js';

	export let data: PageData;
	import logo1 from '$lib/img/logo1.png';
	import { goto } from '$app/navigation';

	let { supabase, session } = data;
	$: ({ supabase, session } = data);


	let noblock = '';
	let place = '';
	let description = '';
	let severity = '';
	let images: FileList | null = null;

	const handleSubmit = async () => {
		// Ensure all required fields are filled
		if (!description || !severity || !images) {
			console.error('Please fill all required fields');
			return;
		}

		// Convert severity to number
		const severityNumber = parseInt(severity);

		// Upload images to Supabase Storage
		const imageFiles = Array.from(images);
		const imageUrls = await Promise.all(
			imageFiles.map(async (file, index) => {
				const { data, error } = await supabase.storage
					.from('reports')
					.upload(Date.now().toString() + index, file);
				if (error) {
					console.error('Error uploading image:', error.message);
					return null;
				}
				return data;
			})
		);
		function extractFullPath(data) {
			return data.map((item) => item.fullPath);
		}
		// Insert report into 'reports' table
		const { data: insertedReport, error } = await supabase.from('reports').insert([
			{
				kolej,
				noblock,
				place,
				description,
				severity: severityNumber,
				images: extractFullPath(imageUrls),
				important,
				owner: session?.user.id
			}
		]);

		if (error) {
			console.error('Error inserting report:', error.message);
			return;
		}

		console.log('Report submitted successfully:', insertedReport);
		goto('/student/form-reports');
		// Clear form fields
		description = '';
		severity = '';
		images = null;
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};

	let kolej = '';
	let option = [
		'KOLEJ RAHMAN PUTRA',
		'KOLEJ TUN FATIMAH',
		'KOLEJ TUN RAZAK',
		'KOLEJ TUN HUSSEIN ONN',
		'KOLEJ TUN DR. ISMAIL',
		'KOLEJ TUANKU CANSELOR',
		'KOLEJ PERDANA',
		'KOLEJ 9 DAN 10',
		'KOLEJ DATIN SERI ENDON',
		'KOLEJ DATO ONN JAAFAR',
	]

	$: console.log('Changed selected:', kolej)
	$: console.log('Updated options:', option)

	let important = '';
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
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<!--<main
	class="px-10 py-10 pt-3 mx-auto max-w-[600px] bg-white border border-orange-700 border-t-0 border-b-0"
>
	<div class="pb-11">
		<img src={logo1} class="pb-3" alt="Sequaia School Logo" />
		<p class="font-bold text-2xl pb-3">Report Form</p>
		<ul class="list-disc pl-5">
			<li class="text-sm mb-2">Fill the form to report</li>
		</ul>
		<hr class="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700" />
	</div>-->

	<main class="register flex flex-col justify-center items-center">
	
	<h1 class="text-3xl font-bold mb-2">Form Report</h1>

	<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
		<dir class="pb-5">
			<ul class="list-disc pl-10">
				<li class="text-sm text-gray-700 font-bold mb-2">Fill the form to report</li>
			</ul>
		</dir>
		<div class="mb-6">
			<label for="kolej" class="block text-gray-700 text-sm font-bold mb-2">Kolej</label>
			<select bind:value={kolej} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline">
				{#each option as value}<option {value}>{value}</option>{/each}
			</select>
		</div>
		<div class="mb-6">
			<label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
			<input
				id="noblock"
				type="text"
				bind:value={noblock}
				placeholder="Type your No. Block here"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
			/>
		</div>
		<div class="mb-6">
			<label for="place" class="block text-gray-700 text-sm font-bold mb-2">Place (Room Number @ Toilet Location @ Common Area)</label>
			<input
				id="place"
				type="text"
				bind:value={place}
				placeholder="Type your place here"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
			/>
		</div>
		<div class="mb-6">
			<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Type your Description here"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				rows="4"
			></textarea>
		</div>
		<div class="mb-6">
			<label for="severity" class="block text-gray-700 text-sm font-bold mb-2">Severity (1-10)</label>
			<input
				type="number"
				id="severity"
				bind:value={severity}
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
				min="1"
				max="10"
			/>
		</div>
		<div class="mb-6">
			<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
			<input
				type="file"
				id="images"
				bind:files={images}
				multiple
				accept="image/*"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
			/>
		</div>
		<div class="mb-6">
			<label for="important" class="block text-gray-700 text-sm font-bold mb-2">Important</label>
			<label class="block text-gray-700 text-sm font-bold mb-2">
				<input type="radio" bind:group={important} value={"Allow contractor to fix/repair without me in the room"} />
				Allow contractor to fix/repair without me in the room
			</label>
			<h1> </h1>
			<label class="block text-gray-700 text-sm font-bold mb-2">
				<input type="radio" bind:group={important} value={"Please contact me before fix / repair"} />
				Please contact me before fix / repair
			</label>
		</div>
		<button type="submit" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
			>Submit</button
		>
		<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student">Cancel</a>
	</form>

	<p class="px-8 text-center text-sm text-muted-foreground">
		By clicking submit, you agree to our{' '}
		<a href="/terms" class="underline underline-offset-4 hover:text-primary">Terms of Service</a
		>{' '}
		and{' '}
		<a href="/privacy" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
	</p>
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <dev class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <slot/>
    </dev>
</section>
