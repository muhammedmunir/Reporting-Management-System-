<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';

	
	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};

	const handlereportdetail = async (id: any) => {
		goto(`/contractor/taken-reports/${id}`);
	};
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Your Taken Jobs</h2>
		<div class="overflow-x-auto">
			<div class="flex flex-row justify-between">
				<div>
					<p class="text-sm font-semibold pb-5">Total : {data.reports?.length}</p>
				</div>
			</div>
			<table class="w-full border-collapse">
				<thead class="bg-gray-200">
					<tr>
						<th class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No</p></th>
						<th class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Kolej</p></th>
						<th class="py-1 px-1 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Defect Type</p></th>
						<th class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Place</p></th>
						<th class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Description</p></th>
						<th class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Options</p></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.reports as _, index}
						<tr class="hover:bg-gray-100">
							<td class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{index + 1}</p></td>
							<td class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{_.kolej}</p></td>
							<td class="py-1 px-1 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{_.defecttype}</p></td>
							<td class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{_.place}</p></td>
							<td class="py-2 px-2 border"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{_.description}</p></td>
							<td class="py-2 px-2 border">
								<div class="flex flex-col">
									<button
										on:click={() => handlereportdetail(_.id)}
										class="specialBtn"
										><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">Update</p></button
									>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Sectionwrapper>
