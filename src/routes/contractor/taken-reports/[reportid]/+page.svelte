<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from '../[reportid]/$types';
    import Map from './Map.svelte';
    import { writable } from 'svelte/store';
    import Sectionwrapper from '../../component/sectionwrapper.svelte';
    import Headers from '../../component/header.svelte';

    export let data: PageData;
    let reports = data.reports;
    console.log(reports);
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let latitude = reports.latitude;
    let longitude = reports.longitude;

    let showSubmitConfirm = false;
    let reportIdToconfirm: any = null;

    let images = writable<FileList | null>(null);
    let errors = writable({ images: '' });

    const validateForm = () => {
        let isValid = true;
        errors.set({ images: '' });

        if (!$images || $images.length === 0) {
            errors.update(err => ({ ...err, images: 'Image is required' }));
            isValid = false;
        }
        return isValid;
    };
    
    function confirmSubmit(id: any) {
        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }
        reportIdToconfirm = id;
        showSubmitConfirm = true;
    }

    async function handleSubmit(event) {
        showSubmitConfirm = false;
        
        const currentTime = new Date().toISOString();
        
        event.preventDefault();

        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        const imageFiles = Array.from($images || []);
        const imageUrls = await Promise.all(
            imageFiles.map(async (file, index) => {
                const { data, error } = await supabase.storage
                    .from('reports')
                    .upload(`${Date.now().toString()}_${index}`, file);
                if (error) {
                    console.error('Error uploading image:', error.message);
                    errors.update(err => ({ ...err, images: error.message }));
                    return null;
                }
                return data;
            })
        );

        if (imageUrls.includes(null)) {
            return;
        }

        console.log("Report ID to confirm:", reportIdToconfirm);

        function extractFullPath(data) {
            return data.map((item) => item.fullPath);
        }

        // Update report with new images and status
        const { error } = await supabase.from('reports').update({
            images: extractFullPath(imageUrls),
            status: 'done progress',
            handleby: session?.user.id,
            updated_at: currentTime
        }).eq('id', reportIdToconfirm);

        if (error) {
            console.error('Error updating report:', error.message);
        } else {
            console.log('Report submitted successfully:', data);
            goto(`/contractor/donejob`);
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
    <div class="rounded px-8 pt-6 flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
        <h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Detail Report</h2>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full" on:submit|preventDefault={() => confirmSubmit(reports.report_id)}>
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
            <div class="mb-6">
                <label for="images" class="block text-gray-700 text-sm font-bold mb-2">Upload New Images</label>
                <input 
                    type="file" 
                    id="images" 
                    bind:files={$images} 
                    multiple 
                    accept="image/*" 
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                />
                {#if $errors.images}<p class="text-red-500 text-xs italic">{$errors.images}</p>{/if}
            </div>
            <button type="submit"
                class="px-4 py-2 mt-4 specialBtnDark rounded hover:bg-red-900"
                >Done Job</button
            >
            <a class="duration-200 hover:text-red-400 cursor-pointer" href="/contractor/taken-reports">Cancel</a>
        </form>
    </div>
</Sectionwrapper>

{#if showSubmitConfirm}
  <div class="modal">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure done job?</p>
      <button on:click={handleSubmit} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
      <button on:click={() => (showSubmitConfirm = false)} class="specialBtn p-2 m-2 px-4 py-2 mt-4">No</button>
    </div>
  </div>
{/if}


<style>
	.modal {
		@apply fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75;
	}
</style>
