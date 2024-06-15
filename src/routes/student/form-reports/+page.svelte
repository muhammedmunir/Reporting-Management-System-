<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
	import Headers from '../component/header.svelte';

	export let data: PageData;
	let reports = data.reports;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	function reroute(href) {
		window.location.href = href;
	};

	const handlereportdetail = async (id: any) => {
		goto(`/student/form-reports/${id}`);
	};

	const handlereportupdate = async (id: any) => {
		goto(`/student/edit-report/${id}`);
	};
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
		<h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Your Reports</h2>
		<div class="overflow-x-auto">
			<div class="flex flex-row justify-between">
				<div>
					<p class="text-sm font-semibold pb-5">Total : {reports?.length}</p>
				</div>
				<div class="p-2">
					<button on:click={ () => reroute("/student/report-form")} class="specialBtnDark hover:bg-red-900">Make Report</button>
				</div>
			</div>
			<table class="w-full border-collapse">
				<thead class="bg-gray-200">
					<tr>
						<th class="py-2 px-4 border">No</th>
						<th class="py-2 px-4 border">Kolej</th>
						<th class="py-2 px-4 border">Place</th>
						<th class="py-2 px-4 border">Description</th>
						<th class="py-2 px-4 border">Status</th>
						<th class="py-2 px-4 border">Options</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.reports as _, index}
						<tr class="hover:bg-gray-100">
							<td class="py-2 px-4 border">{index + 1}</td>
							<td class="py-2 px-4 border">{_.kolej}</td>
							<td class="py-2 px-4 border">{_.place}</td>
							<td class="py-2 px-4 border">{_.description}</td>
							<td class="py-2 px-4 border">{_.status}</td>
							<td class="py-2 px-4 border">
								{#if _.status == 'rejected'}
								<div class="flex flex-col mb-2">
									{#if _.status == 'rejected'}
									<button 
											on:click={() => handlereportupdate(_.id)}
											class="border border-red-500 hover:border-red-700 bg-red p-2"
										>
											Edit
									</button>
									{:else}
										<button 
											disabled
											class="border border-gray-500 hover:border-gray-700 bg-red p-2"
										>
											Edit
										</button>
									{/if}
								</div>
								<div class="flex flex-col">
									{#if _.status == 'rejected'}
										<button 
											on:click={() => alert(`Comment: ${_.comment}`)}
											class="border border-red-500 hover:border-red-700 bg-red p-2"
										>
											Comment
										</button>
									{:else}
										<button 
											disabled
											class="border border-gray-500 hover:border-gray-700 bg-red p-2"
										>
											Comment
										</button>
									{/if}
								</div>
								{/if}
								{#if _.status !== 'rejected'}
								<div class="flex flex-col">
										<button 
											on:click={() => handlereportdetail(_.id)}
											class="border border-green-500 hover:border-green-700 bg-red p-2"
										>
											Detail
										</button>
								</div>
								{/if}
							</td>						
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Sectionwrapper>
