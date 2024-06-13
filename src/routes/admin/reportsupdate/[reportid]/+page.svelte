<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from '../[reportid]/$types';
	import Map from './Map.svelte';

	export let data: PageData;
	let reports = data.reports;
	console.log(reports);
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let latitude = reports.latitude;
	let longitude = reports.longitude;

	const updateReportStatus = async (status: string) => {
		await supabase.from('reports').update({ status }).eq('id', reports.report_id);

		const { data: user_profile } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', reports.owner_id)
			.single();
		let newpoints = user_profile.points + 10;
		await supabase
			.from('profiles')
			.update({ points: newpoints })
			.eq('id', reports.owner_id);

		const { data: user_profile_contractor } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', reports.handleby_id)
			.single();
		let contractor_newpoints = user_profile_contractor.points + 10;
		await supabase
			.from('profiles')
			.update({ points: contractor_newpoints })
			.eq('id', reports.handleby_id);

		goto(`/admin/complete`);
	};
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAP6aYjBNqwoWIRZKKEuyY72-eGSgDeqOg&callback=initMap" async defer></script>
</svelte:head>

<main class="flex-col justify-center items-center">
	<h1 class="text-3xl font-bold mb-2">Detail Report</h1>
	<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
		{#if reports.handler_username}
			<div class="mb-6">
				<label for="contractorname" class="block text-gray-700 text-sm font-bold mb-2">Contractor Name</label>
				<input
					disabled
					id="contractorname"
					type="text"
					value={reports.handler_username}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		{/if}
		{#if reports.owner_username}
			<div class="mb-6">
				<label for="studentname" class="block text-gray-700 text-sm font-bold mb-2">Student Name</label>
				<input
					disabled
					id="studentname"
					type="text"
					value={reports.owner_username}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		{/if}
		{#if reports.kolej}
			<div class="mb-6">
				<label for="kolej" class="block text-gray-700 text-sm font-bold mb-2">Kolej</label>
				<input
					disabled
					id="kolej"
					type="text"
					value={reports.kolej}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		{/if}
		{#if reports.noblock}
			<div class="mb-6">
				<label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
				<input
					disabled
					id="noblock"
					type="text"
					value={reports.noblock}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		{/if}
		{#if reports.place}
			<div class="mb-6">
				<label for="place" class="block text-gray-700 text-sm font-bold mb-2">Place (Room Number @ Toilet Location @ Common Area)</label>
				<input
					disabled
					id="place"
					type="text"
					value={reports.place}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		{/if}
		{#if reports.description}
			<div class="mb-6">
				<label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
				<textarea
					disabled
					id="description"
					value={reports.description}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					rows="4"
				></textarea>
			</div>
		{/if}
		{#if latitude && longitude}
			<div class="mb-6">
				<label for="map" class="block text-gray-700 text-sm font-bold mb-2">Map</label>
				<Map {latitude} {longitude} />
			</div>
		{/if}
		{#each reports.images as childnode, index}
		<div class="mb-6">
			<label for="images" class="block text-gray-700 text-sm font-bold mb-2">Images</label>
			<div class="">
				<img
					width="200"
					src={supabase.storage.from('').getPublicUrl(childnode).data.publicUrl}
					alt="gmabnar"
				/>
			</div>
		</div>
		{/each}
		{#if reports.important}
			<div class="mb-6">
				<label for="important" class="block text-gray-700 text-sm font-bold mb-2">Important</label>
				<input
					disabled
					id="important"
					type="text"
					value={reports.important}
					class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		{/if}
		<button
			type="button"
			on:click={() => updateReportStatus('complete')}
			class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
		>
			Complete
		</button>
		<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/reportsupdate">Cancel</a>
	</form>
</main>
