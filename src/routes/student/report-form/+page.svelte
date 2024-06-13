<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types.js';
	import { writable } from 'svelte/store';

	export let data: PageData;
	//import logo1 from '$lib/img/logo1.png';
	import { goto } from '$app/navigation';
	import Map from './Map.svelte';

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	
	let latitude = writable(null);
  	let longitude = writable(null);

	let noblock = '';
	let place = '';
	let description = '';
	let important = '';
	//let severity = '';
	let images: FileList | null = null;
	let level = '';
	//let map = '';
	let noroom = '';
	let kolej = '';
	let defecttype = '';

	let kolejoption = [
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
	];

	let defecttypeoption = [
		'Facility Damage',
		'Electrical Issues',
		'Plumbing Issues',
	];

	let errors = {
		kolej: '',
		defecttype: '',
		place: '',
		noblock: '',
		level: '',
		noroom: '',
		map: '',
		description: '',
		//severity: '',
		images: '',
		important: ''
	};

	const validateForm = () => {
		let isValid = true;
		errors = {
			kolej: '',
			defecttype: '',
			place: '',
			noblock: '',
			level: '',
			noroom: '',
			map: '',
			description: '',
			//severity: '',
			images: '',
			important: ''
		};

		if (!kolej) {
			errors.kolej = 'Kolej is required';
			isValid = false;
		}
		if (!defecttype) {
			errors.defecttype = 'Defect type is required';
			isValid = false;
		}

		if (defecttype === 'Facility Damage') {
			if (!place) {
				errors.place = 'Place is required';
				isValid = false;
			}
			if (place === 'Room' && !noblock) {
				errors.noblock = 'No. Block is required';
				isValid = false;
			}
			if (place === 'Room' && !level) {
				errors.level = 'Level is required';
				isValid = false;
			}
			if (place === 'Room' && !noroom) {
				errors.noroom = 'No. Room is required';
				isValid = false;
			}
			if (place === 'Room' && !description) {
				errors.description = 'Description is required';
				isValid = false;
			}
			if (place === 'Room' && !images) {
				errors.images = 'Images are required';
				isValid = false;
			}
			if (place === 'Room' && !important) {
				errors.important = 'Important is required';
				isValid = false;
			}
			if (place === 'Toilet' && !noblock) {
				errors.noblock = 'No. Block is required';
				isValid = false;
			}
			if (place === 'Toilet' && !level) {
				errors.level = 'Level is required';
				isValid = false;
			}
			if (place === 'Toilet' && !description) {
				errors.description = 'Description is required';
				isValid = false;
			}
			if (place === 'Toilet' && !images) {
				errors.images = 'Images are required';
				isValid = false;
			}
			if (place === 'Lift' && !noblock) {
				errors.noblock = 'No. Block is required';
				isValid = false;
			}
			if (place === 'Lift' && !description) {
				errors.description = 'Description is required';
				isValid = false;
			}
			if (place === 'Lift' && !images) {
				errors.images = 'Images are required';
				isValid = false;
			}
			if (place === 'Road' && !description) {
				errors.description = 'Description is required';
				isValid = false;
			}
			if (place === 'Road' && !images) {
				errors.images = 'Images are required';
				isValid = false;
			}
		}

		if (defecttype === 'Electrical Issues' || defecttype === 'Plumbing Issues') {
			if (!noblock) {
				errors.noblock = 'No. Block is required';
				isValid = false;
			}
			if (!level) {
				errors.level = 'Level is required';
				isValid = false;
			}
			if (!description) {
				errors.description = 'Description is required';
				isValid = false;
			}
			if (!images) {
				errors.images = 'Images are required';
				isValid = false;
			}
		}

		return isValid;
	};

	const handleSubmit = async () => {
		// Ensure all required fields are filled
		/*if (!description || !images) {
			console.error('Please fill all required fields');
			return;
		}*/

		if (!validateForm()) {
			console.error('Form validation failed');
			return;
		}

		// Convert severity to number
		//const severityNumber = parseInt(severity);

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
				defecttype,
				place,
				noblock,
				level,
				noroom,
				description,
				images: extractFullPath(imageUrls),
				important,
				latitude: $latitude,
        		longitude: $longitude,
				owner: session?.user.id
			}
		]);

		if (error) {
			console.error('Error inserting report:', error.message);
			return;
		}

		console.log('Report submitted successfully:', insertedReport);
		goto('/student/form-reports');
		description = '';
		//severity = '';
		images = null;
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};

	$: console.log('Changed selected:', kolej);
	$: console.log('Updated options:', kolejoption);

	$: console.log('Changed selected:', defecttype);
	$: console.log('Updated options:', defecttypeoption);

	$: console.log('Changed selected place:', place);
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAP6aYjBNqwoWIRZKKEuyY72-eGSgDeqOg&callback=initMap" async defer></script>
</svelte:head>

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
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/coupons">Shop Coupon</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/coupon">My Coupon</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/profile">Profile</a>
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
		</nav>
	</div>
</header>

<main class="register flex flex-col justify-center items-center">
	<h1 class="text-3xl font-bold mb-2">Form Report</h1>

	<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
		<div class="pb-5">
			<ul class="list-disc pl-10">
				<li class="text-sm text-gray-700 font-bold mb-2">Fill the form to report</li>
			</ul>
		</div>

		<div class="mb-6">
			<label for="kolej" class="block text-gray-700 text-sm font-bold mb-2">Kolej</label>
			<select bind:value={kolej} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline">
				{#each kolejoption as value}<option value={value}>{value}</option>{/each}
			</select>
			{#if errors.kolej}<p class="text-red-500 text-xs italic">{errors.kolej}</p>{/if}
		</div>

		<div class="mb-6">
			<label for="defecttype" class="block text-gray-700 text-sm font-bold mb-2">Defect Type</label>
			<select bind:value={defecttype} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline">
				{#each defecttypeoption as value}<option value={value}>{value}</option>{/each}
			</select>
			{#if errors.defecttype}<p class="text-red-500 text-xs italic">{errors.defecttype}</p>{/if}
		</div>

		{#if defecttype === 'Facility Damage'}
			<div class="mb-6">
				<label for="place" class="block text-gray-700 text-sm font-bold mb-2">Place</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={place} value="Room" />
					Room
				</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={place} value="Toilet" />
					Toilet
				</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={place} value="Lift" />
					Lift
				</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={place} value="Road" />
					Road
				</label>
				{#if errors.place}<p class="text-red-500 text-xs italic">{errors.place}</p>{/if}
			</div>
		{/if}

		{#if defecttype === 'Facility Damage' && place === 'Room'}
			<div class="flex mb-6">
				<div class="w-1/2 pr-2">
					<label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
					<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
				</div>
				<div class="w-1/2 pl-2">
					<label for="level" class="block text-gray-700 text-sm font-bold mb-2">Level</label>
					<input id="level" type="number" bind:value={level} placeholder="Type your Level here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.level}<p class="text-red-500 text-xs italic">{errors.level}</p>{/if}
				</div>
			</div>
			<div class="mb-6">
				<label for="noroom" class="block text-gray-700 text-sm font-bold mb-2">No. Room</label>
				<input id="noroom" type="text" bind:value={noroom} placeholder="Type your No. Room here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.noroom}<p class="text-red-500 text-xs italic">{errors.noroom}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<Map {latitude} {longitude} />
				<!--<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<input id="map" type="text" bind:value={map} placeholder="Type your Map here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.map}<p class="text-red-500 text-xs italic">{errors.map}</p>{/if}-->
			</div>
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
				<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
				{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
				<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="important" class="block text-gray-700 text-sm font-bold mb-2">Important</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={important} value="Allow contractor to fix/repair without me in the room" />
					Allow contractor to fix/repair without me in the room
				</label>
				<label class="block text-gray-700 text-sm font-bold mb-2">
					<input type="radio" bind:group={important} value="Please contact me before fix / repair" />
					Please contact me before fix / repair
				</label>
				{#if errors.important}<p class="text-red-500 text-xs italic">{errors.important}</p>{/if}
			</div>
		{/if}

		{#if defecttype === 'Facility Damage' && place === 'Toilet'}
			<div class="flex mb-6">
				<div class="w-1/2 pr-2">
					<label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
					<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
				</div>
				<div class="w-1/2 pl-2">
					<label for="level" class="block text-gray-700 text-sm font-bold mb-2">Level</label>
					<input id="level" type="number" bind:value={level} placeholder="Type your Level here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.level}<p class="text-red-500 text-xs italic">{errors.level}</p>{/if}
				</div>
			</div>
			<div class="mb-6">
				<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<Map {latitude} {longitude} />
				<!--<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<input id="map" type="text" bind:value={map} placeholder="Type your Map here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.map}<p class="text-red-500 text-xs italic">{errors.map}</p>{/if}-->
			</div>
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
				<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
				{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
				<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
			</div>
		{/if}

		{#if defecttype === 'Facility Damage' && place === 'Lift'}
			<div class="flex mb-6">
				<div class="w-1/2 pr-2">
					<label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
					<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
				</div>
			</div>
			<div class="mb-6">
				<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<Map {latitude} {longitude} />
				<!--<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<input id="map" type="text" bind:value={map} placeholder="Type your Map here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.map}<p class="text-red-500 text-xs italic">{errors.map}</p>{/if}-->
			</div>
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
				<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
				{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
				<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
			</div>
		{/if}

		{#if defecttype === 'Facility Damage' && place === 'Road'}
			<div class="mb-6">
				<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<Map {latitude} {longitude} />
				<!--<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<input id="map" type="text" bind:value={map} placeholder="Type your Map here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.map}<p class="text-red-500 text-xs italic">{errors.map}</p>{/if}-->
			</div>
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
				<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
				{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
				<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
			</div>
		{/if}

		{#if defecttype === 'Electrical Issues' || defecttype === 'Plumbing Issues'}
			<div class="flex mb-6">
				<div class="w-1/2 pr-2">
					<label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
					<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
				</div>
			</div>
			<div class="mb-6">
				<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<Map {latitude} {longitude} />
				<!--<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<input id="map" type="text" bind:value={map} placeholder="Type your Map here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.map}<p class="text-red-500 text-xs italic">{errors.map}</p>{/if}-->
			</div>
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
				<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
				{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
			</div>
			<div class="mb-6">
				<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
				<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
				{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
			</div>
		{/if}

		<button type="submit" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
		<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student">Cancel</a>
	</form>
</main>

<section class="min-h-screen flex flex-col px-4">
	<div class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
		<slot />
	</div>
</section>