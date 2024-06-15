<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from '../[detailreportid]/$types';
	import Map from './Map.svelte';
	import Sectionwrapper from '../../component/sectionwrapper.svelte';
	import Headers from '../../component/header.svelte';

	export let data: PageData;
	let reports = data.reports;
	console.log(reports);
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let latitude = reports.latitude;
	let longitude = reports.longitude;

	onMount(() => {
		console.log(reports);
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAP6aYjBNqwoWIRZKKEuyY72-eGSgDeqOg&callback=initMap" async defer></script>
</svelte:head>

<Sectionwrapper>
    <Headers { data } />
    <div class="rounded px-8 pt-6 flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
        <h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Detail Report</h2>
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
                <a href="/student/form-reports" class="duration-200 hover:text-red-400 cursor-pointer">Back</a>
        </form>
    </div>
</Sectionwrapper>
