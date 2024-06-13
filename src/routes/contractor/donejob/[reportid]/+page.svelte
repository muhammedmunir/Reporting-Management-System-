<script lang="ts">
    import { goto } from '$app/navigation';
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
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAP6aYjBNqwoWIRZKKEuyY72-eGSgDeqOg&callback=initMap" async defer></script>
</svelte:head>

<main class="flex flex-col relative z-20">
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
        <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/contractor/donejob">Cancel</a>
    </form>
</main>
