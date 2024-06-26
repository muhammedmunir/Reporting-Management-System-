<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
	import Headers from '../component/header.svelte';

	export let data: PageData;
	let reports = data.reports;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	
	let currentPage = 1;
	const rowsPerPage = 5;

	function reroute(href: any) {
		window.location.href = href;
	};

	const handlereportdetail = async (id: any) => {
		goto(`/student/form-reports/${id}`);
	};

	function nextPage() {
		if (currentPage < Math.ceil(reports.length / rowsPerPage)) {
			currentPage += 1;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage -= 1;
		}
	}

	$: data.reports = reports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Your Reports</h2>
		<div class="overflow-x-auto w-full">
			<div class="flex flex-row justify-between w-full">
				{#if reports?.length > 0}
					<div class="mb-4 md:mb-0">
						<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Total : {reports?.length}</p>
					</div>
				{/if}
				<div class="p-2">
					<button on:click={ () => reroute("/student/report-form")} class="specialBtnDark hover:bg-red-900"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Make Report</p></button>
				</div>
			</div>
			{#if reports?.length > 0}
				<table class="w-full border-collapse">
					<thead class="bg-gray-200">
						<tr>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Kolej</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Place</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Description</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Status</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Options</p></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.reports as _, index}
							<tr class="hover:bg-gray-100">
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">{(currentPage - 1) * rowsPerPage + index + 1}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">{_.kolej}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">{_.place}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">{_.description}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full">{_.status}</p></td>
								<td class="py-2 px-4 border text-center">
									{#if _.status == 'rejected'}
									<div class="flex flex-col mb-2">
										<button 
											on:click={() => alert(`Comment: ${_.comment}`)}
											class="specialBtn p-2"
										>
										<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Comment</p>
										</button>
									</div>
									{/if}
									<div class="flex flex-col space-y-2">
										<button 
											on:click={() => handlereportdetail(_.id)}
											class="specialBtnDark hover:bg-red-900 p-2"
										>
										<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Detail</p>
										</button>
									</div>
								</td>						
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="flex justify-between mt-4">
					<button on:click={previousPage} disabled={currentPage === 1} class="specialBtnDark hover:bg-red-900">
						&larr;
					</button>
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w/[1200px] mx-auto w/full font-semibold">Page {currentPage} of {Math.ceil(reports.length / rowsPerPage)}</p>
					<button on:click={nextPage} disabled={currentPage === Math.ceil(reports.length / rowsPerPage)} class="specialBtnDark hover:bg-red-900">
						&rarr;
					</button>
				</div>
			{:else}
				<p class="text-12l sm:text-1xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">No available reports</p>
			{/if}
		</div>
	</div>
</Sectionwrapper>