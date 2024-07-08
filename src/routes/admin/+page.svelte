<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
    import type { PageData } from './$types';
	import Sectionwrapper from './component/sectionwrapper.svelte';
    import Headers from './component/header.svelte';

    export let data: PageData;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let user_profile = data.user_profile;
    let reports = data.reports;
    let statusCounts = data.statusCounts;
    let contractors = data.contractors;
    let claimed_coupons = data.claimed_coupons;

    let currentPage = 1;
    let currentPages = 1;
	const rowsPerPage = 3;

    let showOption = false;
    let applyId: any = null;

    function handleoption(id: any) {
		applyId = id;
		showOption = true;
	};

	const confirmapprove = async () => {
        try {
            showOption = false;

            const { error } = await supabase.from('apply_contractor').update({ options: 'approved' }).eq('id', applyId);

            if (error) {
                console.error('Error approve contractor:', error.message);
            } else {
                console.log('Approve contractor successfully');
                await invalidate('admin:apply_contractor'); // Ensure invalidation completes before navigating
                console.log('Approve contractor invalidated');
                await goto('/admin'); // Await goto to ensure navigation happens
                console.log('Navigation to /admin triggered');
            }

            applyId = null;
        } catch (err) {
            console.error('Unexpected error during apply contractor:', err);
        }
    };

    const confirmreject = async () => {
        try {
            showOption = false;

            const { error } = await supabase.from('apply_contractor').update({ options: 'rejected' }).eq('id', applyId);

            if (error) {
                console.error('Error Reject contractor:', error.message);
            } else {
                console.log('Reject contractor successfully');
                await invalidate('admin:apply_contractor'); // Ensure invalidation completes before navigating
                console.log('Reject contractor invalidated');
                await goto('/admin'); // Await goto to ensure navigation happens
                console.log('Navigation to /admin triggered');
            }

            applyId = null;
        } catch (err) {
            console.error('Unexpected error during apply contractor:', err);
        }
    };
    
    const formatDate = (dateString: string) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kuala_Lumpur'
        };
        return new Date(dateString).toLocaleString('en-GB', options);
    };

    function nextPage() {
		if (currentPage < Math.ceil(contractors.length / rowsPerPage)) {
			currentPage += 1;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage -= 1;
		}
	}

	function nextPages() {
		if (currentPages < Math.ceil(claimed_coupons.length / rowsPerPage)) {
			currentPages += 1;
		}
	}

	function previousPages() {
		if (currentPages > 1) {
			currentPages -= 1;
		}
	}

	$: data.contractors = contractors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
	$: data.claimed_coupons = claimed_coupons.slice((currentPages - 1) * rowsPerPage, currentPages * rowsPerPage);
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
        <h2 class="text-1xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Welcome Contractor, {user_profile.username}</h2>
        <div class="overflow-x-auto w-full">
            <div class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">Status Reports</h2>
                <table class="w-full border-collapse">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Pending</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Search Contractor</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">In Progress</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Done Progress</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Complete</p></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="hover:bg-gray-100">
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts.pending}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts['search contractor']}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts['in progress']}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts['done progress']}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts.complete}</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">Contractor Apply</h2>
                {#if contractors?.length > 0}
                    <table class="w-full border-collapse">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No.</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Email</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Name</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No. Phone</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Apply At</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Options</p></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            {#each data.contractors as contractor, index}
                                <tr class="hover:bg-gray-100">
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.email}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.fullname}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.phone_number}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{formatDate(contractor.create_at)}</p></td>
                                    <td class="py-2 px-4 border text-center">
                                        {#if contractor.options == 'null'}
                                            <div class="flex flex-col space-y-2">
                                                <button
                                                        on:click={() => handleoption(contractor.id)}
                                                        class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20"
                                                        ><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">option</p></button
                                                >
                                            </div>
                                        {/if}
                                        {#if contractor.options == 'approved'}
                                            <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.options}</p>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    <div class="flex justify-between mt-4">
                        <button on:click={previousPage} disabled={currentPage === 1} class="specialBtnDark hover:bg-red-900">
                            &larr;
                        </button>
                        <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w/[1200px] mx-auto w/full font-semibold">Page {currentPage} of {Math.ceil(contractors.length / rowsPerPage)}</p>
                        <button on:click={nextPage} disabled={currentPage === Math.ceil(contractors.length / rowsPerPage)} class="specialBtnDark hover:bg-red-900">
                            &rarr;
                        </button>
                    </div>
                {:else}
                <p class="text-12l sm:text-1xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">No available contractors</p>
                {/if}
            </div>
    
            <div class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">Claimed Coupons</h2>
                {#if claimed_coupons?.length > 0}
                    <table class="w-full border-collapse">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No.</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Name</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Arked</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Description</p></th>
                                <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Claimed At</p></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            {#each data.claimed_coupons as coupon, index}
                                <tr class="hover:bg-gray-100">
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{coupon.profiles.username}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{coupon.coupons.title}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{coupon.coupons.description}</p></td>
                                    <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{formatDate(coupon.claimed_at)}</p></td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    <div class="flex justify-between mt-4">
                        <button on:click={previousPages} disabled={currentPages === 1} class="specialBtnDark hover:bg-red-900">
                            &larr;
                        </button>
                        <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w/[1200px] mx-auto w/full font-semibold">Page {currentPages} of {Math.ceil(claimed_coupons.length / rowsPerPage)}</p>
                        <button on:click={nextPages} disabled={currentPages === Math.ceil(claimed_coupons.length / rowsPerPage)} class="specialBtnDark hover:bg-red-900">
                            &rarr;
                        </button>
                    </div>
                {:else}
                <p class="text-12l sm:text-1xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">No available claimed coupons</p>
                {/if}
            </div>
        </div>
    </div>
</Sectionwrapper>

{#if showOption}
  <div class="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Choose Approve or Reject!</p>
      <button on:click={ confirmapprove } class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Approve</button>
      <button on:click={ confirmreject } class="specialBtn p-2 m-2 px-4 py-2 mt-4">Reject</button>
    </div>
  </div>
{/if}

<style>
	.modal {
		@apply fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75;
	}
</style>