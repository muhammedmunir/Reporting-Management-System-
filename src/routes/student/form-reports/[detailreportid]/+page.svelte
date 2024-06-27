<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { PageData } from '../[detailreportid]/$types';
    import Map from './Map.svelte';
    import { writable } from 'svelte/store';
	import Sectionwrapper from '../../component/sectionwrapper.svelte';
	import Headers from '../../component/header.svelte';
    import { invalidate } from '$app/navigation';

    export let data: PageData;
    let reports = data.reports;
    console.log(reports);
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let latitude = reports.latitude || '';
    let longitude = reports.longitude || '';

    let place = reports.place || '';
    let noblock = reports.noblock || '';
    let description = reports.description || '';
    let important = reports.important || '';
    let images = writable<FileList | null>(null);
    let level = reports.level || parseInt('');
    let noroom = reports.noroom || '';
    let defecttype = reports.defecttype || '';

    let editMode = false;
    
	let showSubmitConfirm = false;

    let showConfirmdelete = false;
	let reportIdToDelete: any = null;
    

    onMount(() => {
        console.log(reports);
    });

    let errors = {
        defecttype: '',
        noblock: '',
        level: '',
        noroom: '',
        description: '',
        images: ''
    };

    const validateForm = () => {
        let isValid = true;
        errors = {
            defecttype: '',
            noblock: '',
            level: '',
            noroom: '',
            description: '',
            images: ''
        };

        if (defecttype === 'Facility Damage') {
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
            if (place === 'Room' && !($images || []).length) {
                errors.images = 'Images are required';
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
            if (place === 'Toilet' && !($images || []).length) {
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
            if (place === 'Lift' && !($images || []).length) {
                errors.images = 'Images are required';
                isValid = false;
            }
            if (place === 'Road' && !description) {
                errors.description = 'Description is required';
                isValid = false;
            }
            if (place === 'Road' && !($images || []).length) {
                errors.images = 'Images are required';
                isValid = false;
            }
        }

        if (defecttype === 'Electrical Issues' || defecttype === 'Plumbing Issues') {
            if (!noblock) {
                errors.noblock = 'No. Block is required';
                isValid = false;
            }
            if (!description) {
                errors.description = 'Description is required';
                isValid = false;
            }
            if (!($images || []).length) {
                errors.images = 'Images are required';
                isValid = false;
            }
        }

        return isValid;
    };

    function updatereport() {
		if (!validateForm()) {
			console.error('Form validation failed');
			return;
		}
		showSubmitConfirm = true;
	};

	const confirmSubmit = async (event) => {
		showSubmitConfirm = false;

        const currentTime = new Date().toISOString();

        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        const updatedData = {
            place,
            noblock,
            level: parseInt(level) || null,
            noroom,
            description,
            important,
            defecttype
        };

        const imageFiles = Array.from($images || []);
        const imageUrls = await Promise.all(
            imageFiles.map(async (file, index) => {
                const { data, error } = await supabase.storage
                    .from('reports')
                    .upload(`${Date.now().toString()}_${index}`, file);
                if (error) {
                    console.error('Error uploading image:', error.message);
                    return null;
                }
                return data;
            })
        );

        if (imageUrls.includes(null)) {
            return;
        }

        function extractFullPath(data) {
			return data.map((item) => item.fullPath);
		}

        const { error } = await supabase.from('reports').update({
            images: extractFullPath(imageUrls),
            status: 'pending',
            comment: 'null',
            updated_at: currentTime,
            ...updatedData
        }).eq('id', reports.id);

        if (error) {
            console.error('Error updating report:', error.message);
        } else {
            console.log('Report updated successfully');
            goto('/student/form-reports');
        }
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
                await invalidate('student:reports'); // Ensure invalidation completes before navigating
                console.log('Reports invalidated');
                await goto('/student/form-reports'); // Await goto to ensure navigation happens
                console.log('Navigation to /student/form-reports triggered');
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
    <div class="rounded px-8 pt-6 flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Edit Report</h2>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full" on:submit|preventDefault={editMode ? updatereport : null}>
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
                        bind:value={defecttype}
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
                        bind:value={place}
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            {/if}
            {#if reports.noblock}
                <div class="mb-6">
                    <label for="noblock" class="block text-gray-700 text-sm font-bold mb-2">No. Block</label>
                    <input
                        disabled={!editMode}
                        id="noblock"
                        type="text"
                        bind:value={noblock}
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {#if errors.noblock}<p class="text-red-500 text-xs italic">{errors.noblock}</p>{/if}
                </div>
            {/if}
            {#if reports.level}
                <div class="mb-6">
                    <label for="level" class="block text-gray-700 text-sm font-bold mb-2">Level</label>
                    <input
                        disabled={!editMode}
                        id="level"
                        type="number"
                        bind:value={level}
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {#if errors.level}<p class="text-red-500 text-xs italic">{errors.level}</p>{/if}
                </div>
            {/if}
            {#if reports.noroom}
                <div class="mb-6">
                    <label for="noroom" class="block text-gray-700 text-sm font-bold mb-2">No. Room</label>
                    <input
                        disabled={!editMode}
                        id="noroom"
                        type="text"
                        bind:value={noroom}
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {#if errors.noroom}<p class="text-red-500 text-xs italic">{errors.noroom}</p>{/if}
                </div>
            {/if}
            {#if reports.description}
                <div class="mb-6">
                    <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description of the Report</label>
                    <textarea
                        disabled={!editMode}
                        id="description"
                        bind:value={description}
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                    ></textarea>
                    {#if errors.description}<p class="text-red-500 text-xs italic">{errors.description}</p>{/if}
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
                        bind:value={important}
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
            {#if reports.status === 'rejected'}
            <div class="mb-6">
                <label for="images" class="block text-gray-700 text-sm font-bold mb-2">Upload New Images</label>
                <input
                    disabled={!editMode}
                    type="file"
                    id="images"
                    bind:files={$images}
                    multiple
                    accept="image/*"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {#if errors.images}<p class="text-red-500 text-xs italic">{errors.images}</p>{/if}
            </div>
            {/if}
            <div class="flex items-center justify-between">
                {#if reports.status === 'rejected'}
                    <button type="button" on:click={() => editMode = !editMode} class="specialBtn py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {editMode ? 'Cancel' : 'Edit'}
                    </button>
                    {#if editMode}
                        <button type="submit" class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Save
                        </button>
                    {/if}
                    {#if !editMode}
                    <button on:click={() => handlereportdelete(reports.id)} class="specialBtn p-2">
                        <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullfont-semibold">Delete</p>
                    </button>
                    {/if}
                {/if}
                <a href="/student/form-reports" class="duration-200 hover:text-red-400 cursor-pointer">Back</a>
            </div>
        </form>
    </div>
</Sectionwrapper>

{#if showSubmitConfirm}
  <div class="modal">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure you have filled everything correctly?</p>
      <button on:click={confirmSubmit} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
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
