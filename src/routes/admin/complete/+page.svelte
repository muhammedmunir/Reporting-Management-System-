<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';

	export let data: PageData;
	let reports = data.reports;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let currentPage = 1;
	const rowsPerPage = 5;

	const handlereportdetail = async (id: any) => {
		goto(`/admin/complete/${id}`);
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
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Completed Reports</h2>
		{#if data.reports?.length > 0}
			<div class="overflow-x-auto w-full">
				<div class="flex flex-row justify-between w-full">
					<div>
						<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Total : {data.reports?.length}</p>
					</div>
				</div>
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
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.kolej}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.place}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.description}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.status}</p></td>
								<td class="py-2 px-4 border text-center">
									<div class="flex flex-col space-y-2">
									<button
											on:click={() => handlereportdetail(_.id)}
											class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20"
											><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">Detail</p></button
										>
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
			</div>
		{:else}
			<p class="text-12l sm:text-1xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">No available complete</p>
		{/if}
	</div>
</Sectionwrapper>