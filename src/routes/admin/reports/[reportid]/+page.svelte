<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from '../[reportid]/$types';
	import Map from './Map.svelte';

	export let data: PageData;
	let reports = data.reports;
	console.log(reports);
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let latitude = reports.latitude;
	let longitude = reports.longitude;

	let showApprovalOptions = true;
	let showPriceSection = false;
	let showCommentSection = false;
	let price = '';
	let comment = '';

	onMount(() => {
		console.log(reports);
	});

	const approve = () => {
		showApprovalOptions = false;
		showPriceSection = true;
	};

	const reject = () => {
		showApprovalOptions = false;
		showCommentSection = true;
	};

	const cancel = () => {
		showPriceSection = false;
		showCommentSection = false;
		showApprovalOptions = true;
	};

	let errors = {
		comment: ''
	};

	let errorss = {
		price: ''
	};

	const validateForm = () => {
		let isValid = true;
		errors = {
			comment: ''
		};

		if (!comment) {
			errors.comment = 'Comment is required';
			isValid = false;
		}
		return isValid;
	};

	const validateForms = () => {
		let isValid = true;
		errorss = {
			price: ''
		};

		if (!price) {
			errorss.price = 'Price is required';
			isValid = false;
		}
		return isValid;
	};

	const handleSubmit = async () => {
		if (showPriceSection) {
			if (!validateForms()) {
				console.error('Form validation failed');
				return;
			}
			await supabase.from('reports').update({ status: 'search contractor', price }).eq('id', reports.report_id);
			goto('/admin/reportsupdate');
		} else if (showCommentSection) {
			if (!validateForm()) {
				console.error('Form validation failed');
				return;
			}
			await supabase.from('reports').update({ status: 'rejected', comment }).eq('id', reports.report_id);
			goto('/admin/reports');
		}
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
		{#if reports.owner_username}
            <div class="mb-6">
                <label for="studentname" class="block text-gray-700 text-sm font-bold mb-2">Student Name</label>
                <input
                    disabled
                    id="studentname"
                    type="text"
                    bind:value={reports.owner_username}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        {/if}
        {#if reports.owner_phone}
            <div class="mb-6">
                <label for="studentphone" class="block text-gray-700 text-sm font-bold mb-2">Student Phone</label>
                <input
                    disabled
                    id="studentphone"
                    type="text"
                    bind:value={reports.owner_phone}
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
                    bind:value={reports.kolej}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        {/if}
        {#if reports.defecttype}
            <div class="mb-6">
                <label for="defecttype" class="block text-gray-700 text-sm font-bold mb-2">Defect Type</label>
                <input
                    disabled
                    id="defecttype"
                    type="text"
                    bind:value={reports.defecttype}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        {/if}
        {#if reports.place}
            <div class="mb-6">
                <label for="place" class="block text-gray-700 text-sm font-bold mb-2">Place</label>
                <input
                    disabled
                    id="place"
                    type="text"
                    bind:value={reports.place}
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
                    bind:value={reports.noblock}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        {/if}
        {#if reports.level}
            <div class="mb-6">
                <label for="level" class="block text-gray-700 text-sm font-bold mb-2">Level</label>
                <input
                    disabled
                    id="level"
                    type="text"
                    bind:value={reports.level}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        {/if}
        {#if reports.noroom}
            <div class="mb-6">
                <label for="noroom" class="block text-gray-700 text-sm font-bold mb-2">No. Room</label>
                <input
                    disabled
                    id="noroom"
                    type="text"
                    bind:value={reports.noroom}
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
                    bind:value={reports.description}
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
                    bind:value={reports.important}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        {/if}
		<!-- Approval buttons -->
		{#if showApprovalOptions}
			<button type="button" on:click={approve} class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Approve</button>
			<button type="button" on:click={reject} class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Reject</button>
			<a href="/admin/reports" class="duration-200 hover:text-indigo-400 cursor-pointer">Cancel</a>
		{/if}
		<form on:submit|preventDefault={handleSubmit}>
			<!-- Price section -->
			{#if showPriceSection}
				<div class="mb-6">
					<label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price(RM)</label>
					<input type="text" id="price" bind:value={price} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errorss.price}<p class="text-red-500 text-xs italic">{errorss.price}</p>{/if}
				</div>
				<button type="submit" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
				<button type="button" on:click={cancel} class="duration-200 hover:text-indigo-400 cursor-pointer">Cancel</button>
			{/if}
		  
			<!-- Comment section -->
			{#if showCommentSection}
				<div class="mb-6">
					<label for="comment" class="block text-gray-700 text-sm font-bold mb-2">Comment</label>
					<input type="text" id="comment" bind:value={comment} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
					{#if errors.comment}<p class="text-red-500 text-xs italic">{errors.comment}</p>{/if}
				</div>
				<button type="submit" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
				<button type="button" on:click={cancel} class="duration-200 hover:text-indigo-400 cursor-pointer">Cancel</button>
			{/if}
		</form>
	</form>
</main>
