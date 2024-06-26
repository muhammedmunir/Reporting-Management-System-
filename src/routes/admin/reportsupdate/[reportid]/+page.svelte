<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from '../[reportid]/$types';
	import Map from './Map.svelte';
	import Sectionwrapper from '../../component/sectionwrapper.svelte';
    import Headers from '../../component/header.svelte';
	import { invalidate } from '$app/navigation';
	
	export let data: PageData;
	let reports = data.reports;
	console.log(reports);
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let latitude = reports.latitude;
	let longitude = reports.longitude;

	let showSubmitConfirm = false;

    let showConfirmdelete = false;
	let reportIdToDelete: any = null;
	let reportIdToconfirm: any = null;

	function confirmreport(id: any) {
		reportIdToconfirm = id;
		showSubmitConfirm = true;
	};

	const updateReportStatus = async () => {

		showSubmitConfirm = false;

		await supabase.from('reports').update({ status: 'complete' }).eq('id', reportIdToconfirm);

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
		/*
		const { data: user_profile_contractor } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', reports.handler_id)
			.single();
		let contractor_newpoints = user_profile_contractor.points + 10;
		await supabase
			.from('profiles')
			.update({ points: contractor_newpoints })
			.eq('id', reports.handler_id);
		*/
		goto(`/admin/complete`);
	};

	function handlereportdelete(id: any) {
		reportIdToDelete = id;
		showConfirmdelete = true;
	};

	const confirmdelete = async () => {
        try {
            showConfirmdelete = false;

            const { error } = await supabase.from('reports').delete().eq('id', reportIdToDelete);

            if (error) {
                console.error('Error deleting report:', error.message);
            } else {
                console.log('Report deleted successfully');
                await invalidate('admin:reports'); // Ensure invalidation completes before navigating
                console.log('Reports invalidated');
                await goto('/admin/reportsupdate'); // Await goto to ensure navigation happens
                console.log('Navigation to /admin/reportsupdate triggered');
            }

            reportIdToDelete = null;
        } catch (err) {
            console.error('Unexpected error during report deletion:', err);
        }
    };
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAP6aYjBNqwoWIRZKKEuyY72-eGSgDeqOg&callback=initMap" async defer></script>
</svelte:head>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Detail Report</h2>
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
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
            {#if reports.price}
            <div class="mb-6">
                <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price(RM)</label>
                <input
                    disabled
                    id="price"
                    type="text"
                    bind:value={reports.price}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {/if}
            {#if reports.date}
            <div class="mb-6">
                <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date to Job</label>
                <input
                    disabled
                    id="date"
                    type="text"
                    bind:value={reports.date}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {/if}
			<div class="flex items-center justify-between">
			{#if reports.status === 'done progress'}
			<button
				type="button"
				on:click={() => confirmreport(reports.report_id)}
				class="px-4 py-2 mt-4 specialBtnDark rounded hover:bg-red-900"
			>
				Complete
			</button>
			{/if}
			{#if reports.status === 'search contractor'}
				<button on:click={() => handlereportdelete(reports.report_id)} class="specialBtn p-2">
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullfont-semibold">Delete</p>
				</button>
			{/if}
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/reportsupdate">Back</a>
		</div>
		</form>
	</div>
</Sectionwrapper>

{#if showSubmitConfirm}
  <div class="modal">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure this report complete?</p>
      <button on:click={updateReportStatus} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
      <button on:click={() => (showSubmitConfirm = false)} class="specialBtn p-2 m-2 px-4 py-2 mt-4">No</button>
    </div>
  </div>
{/if}

{#if showConfirmdelete}
  <div class="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure you want to delete this report?</p>
      <button on:click={confirmdelete} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
      <button on:click={() => (showConfirmdelete = false)} class="specialBtn p-2 m-2 px-4 py-2 mt-4">No</button>
    </div>
  </div>
{/if}

<style>
	.modal {
		@apply fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75;
	}
</style>