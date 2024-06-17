<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';

	export let data: PageData;
	let { students, contractors } = data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Student and Contractor</h2>
		
		<div class="flex flex-row justify-between">
			<div>
				<p class="font-bold text-2xl">View Students</p>
			</div>
		</div>
		<div class="overflow-x-auto w-full">
			<div class="flex flex-row justify-between w-full">
				<div>
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Total : {students?.length}</p>
				</div>
			</div>
			<table class="w-full border-collapse">
				<thead class="bg-gray-200">
					<tr>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No</p></th>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Username</p></th>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Email</p></th>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Matrik ID</p></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each students as student, index}
						<tr class="hover:bg-gray-100">
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{student.username}</p></td>
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{student.email}</p></td>
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{student.matrikID}</p></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		<div class="flex flex-row justify-between">
			<div>
				<p class="font-bold text-2xl">View Contractors</p>
			</div>
		</div>
		<div class="overflow-x-auto w-full">
			<div class="flex flex-row justify-between w-full">
				<div>
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Total : {contractors?.length}</p>
				</div>
			</div>
			<table class="w-full border-collapse">
				<thead class="bg-gray-200">
					<tr>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No</p></th>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Username</p></th>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Email</p></th>
						<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No. CIDB</p></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each contractors as contractor, index}
						<tr class="hover:bg-gray-100">
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.username}</p></td>
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.email}</p></td>
							<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.matrikID}</p></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</Sectionwrapper>
