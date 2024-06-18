<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types.js';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import Map from './Map.svelte';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
	import Headers from '../component/header.svelte';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	
	let latitude = writable(null);
  	let longitude = writable(null);

	let noblock = '';
	let place = '';
	let description = '';
	let important = '';
	let images: FileList | null = null;
	let level = parseInt('');
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
		latitude: '',
		description: '',
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
			latitude: '',
			description: '',
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
			if (place === 'Room' && !($latitude)) {
				errors.latitude = 'Map is required';
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
			if (place === 'Toilet' && !($latitude)) {
				errors.latitude = 'Map is required';
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
			if (place === 'Lift' && !($latitude)) {
				errors.latitude = 'Map is required';
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
			if (place === 'Road' && !($latitude)) {
				errors.latitude = 'Map is required';
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
			if (!($latitude)) {
				errors.latitude = 'Map is required';
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
		images = null;
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

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Form Report</h2>
		<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
			<div class="pb-5">
				<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Fill the form to report</p>
				<hr>
			</div>
			
			<div class="mb-6">
				<label for="kolej" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Kolej</label>
				<select bind:value={kolej} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline">
					{#each kolejoption as value}<option value={value}>{value}</option>{/each}
				</select>
				{#if errors.kolej}<p class="text-red-500 text-xs italic">{errors.kolej}</p>{/if}
			</div>

			<div class="mb-6">
				<label for="defecttype" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Defect Type</label>
				<select bind:value={defecttype} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline">
					{#each defecttypeoption as value}<option value={value}>{value}</option>{/each}
				</select>
				{#if errors.defecttype}<p class="text-red-500 text-xs italic">{errors.defecttype}</p>{/if}
			</div>

			{#if defecttype === 'Facility Damage'}
				<div class="mb-6">
					<label for="place" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Place</label>
					<label class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">
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
						<label for="noblock" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Block</label>
						<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
						{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
					</div>
					<div class="w-1/2 pl-2">
						<label for="level" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Level</label>
						<input id="level" type="number" bind:value={level} placeholder="Type your Level here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
						{#if errors.level}<p class="text-red-500 text-xs italic">{errors.level}</p>{/if}
					</div>
				</div>
				<div class="mb-6">
					<label for="noroom" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Room</label>
					<input id="noroom" type="text" bind:value={noroom} placeholder="Type your No. Room here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.noroom}<p class="text-red-500 text-xs italic">{errors.noroom}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="map" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Map</label>
					<Map {latitude} {longitude} />
					{#if errors.latitude}<p class="text-red-500 text-xs italic">{errors.latitude}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="description" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Description of the Report</label>
					<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
					{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="images" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Images</label>
					<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="important" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Important</label>
					<label class="block text-gray-700 text-sm mb-2 max-w-[1000px]">
						<input type="radio" bind:group={important} value="Allow contractor to fix/repair without me in the room" />
						Allow contractor to fix/repair without me in the room
					</label>
					<label class="block text-gray-700 text-sm mb-2 max-w-[1000px]">
						<input type="radio" bind:group={important} value="Please contact me before fix / repair" />
						Please contact me before fix / repair
					</label>
					{#if errors.important}<p class="text-red-500 text-xs italic">{errors.important}</p>{/if}
				</div>
			{/if}

			{#if defecttype === 'Facility Damage' && place === 'Toilet'}
				<div class="flex mb-6">
					<div class="w-1/2 pr-2">
						<label for="noblock" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Block</label>
						<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
						{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
					</div>
					<div class="w-1/2 pl-2">
						<label for="level" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Level</label>
						<input id="level" type="number" bind:value={level} placeholder="Type your Level here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
						{#if errors.level}<p class="text-red-500 text-xs italic">{errors.level}</p>{/if}
					</div>
				</div>
				<div class="mb-6">
					<label for="map" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Map</label>
					<Map {latitude} {longitude} />
					{#if errors.latitude}<p class="text-red-500 text-xs italic">{errors.latitude}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="description" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Description of the Report</label>
					<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
					{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="images" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Images</label>
					<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
				</div>
			{/if}

			{#if defecttype === 'Facility Damage' && place === 'Lift'}
				<div class="mb-6">
					<div>
						<label for="noblock" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Block</label>
						<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
						{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
					</div>
				</div>
				<div class="mb-6">
					<label for="map" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Map</label>
					<Map {latitude} {longitude} />
					{#if errors.latitude}<p class="text-red-500 text-xs italic">{errors.latitude}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="description" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Description of the Report</label>
					<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
					{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="images" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Images</label>
					<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
				</div>
			{/if}

			{#if defecttype === 'Facility Damage' && place === 'Road'}
				<div class="mb-6">
					<label for="map" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Map</label>
					<Map {latitude} {longitude} />
					{#if errors.latitude}<p class="text-red-500 text-xs italic">{errors.latitude}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="description" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Description of the Report</label>
					<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
					{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="images" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Images</label>
					<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
				</div>
			{/if}

			{#if defecttype === 'Electrical Issues' || defecttype === 'Plumbing Issues'}
				<div class="mb-6">
					<div>
						<label for="noblock" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Block</label>
						<input id="noblock" type="text" bind:value={noblock} placeholder="Type your No. Block here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
						{#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
					</div>
				</div>
				<div class="mb-6">
					<label for="map" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Map</label>
					<Map {latitude} {longitude} />
					{#if errors.latitude}<p class="text-red-500 text-xs italic">{errors.latitude}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="description" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Description of the Report</label>
					<textarea id="description" bind:value={description} placeholder="Type your Description here" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
					{#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
				</div>
				<div class="mb-6">
					<label for="images" class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Images</label>
					<input type="file" id="images" bind:files={images} multiple accept="image/*" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
				</div>
			{/if}

			<button type="submit" class="px-4 py-2 mt-4 specialBtnDark hover:bg-red-900">Submit</button>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/student">Cancel</a>
		</form>
	</div>
</Sectionwrapper>