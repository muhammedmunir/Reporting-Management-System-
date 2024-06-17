<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';
	
	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handlereportdetail = async (report_id: any) => {
		goto(`/admin/reportsupdate/${report_id}`);
	};

	const handledelete = async () => {
		await supabase.from('reports').delete().eq('id', _.id);
		invalidate('admin:reports');
	};
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">New Reports</h2>
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
									<div class="flex flex-col mb-2">
										{#if _.status == 'in progress' || _.status == 'done progress'}
										<button
											on:click={() => handlereportdetail(_.report_id)}
											class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20"
											><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">Detail</p></button
										>
										{:else}
											<button 
												disabled
												class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none sm:px-20"
											>
											<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">Detail</p>
											</button>
										{/if}
									</div>
									<div class="flex flex-col">
										{#if _.status == 'search contractor'}
											<button 
												on:click={async () => {
													handledelete()
												}}
												class="border specialBtn p-2"
											>
												Delete
											</button>
										{:else}
											<button 
												disabled
												class="border border-gray-500 hover:border-gray-700 bg-red p-2"
											>
												Delete
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
		<p class="text-12l sm:text-1xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">No available update report</p>
		{/if}
	</div>
</Sectionwrapper>
