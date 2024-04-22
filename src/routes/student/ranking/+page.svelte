<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let reports = data.reports;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="p-2">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">Your Reports</p>
			<p class="text-sm font-semibold pb-5">Total : {reports?.length}</p>
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="py-2 px-4 border">No</th>
					<th class="py-2 px-4 border">Username</th>
					<th class="py-2 px-4 border">Full Name</th>
					<th class="py-2 px-4 border">Matrik ID</th>
					<th class="py-2 px-4 border">Obtained Points</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each reports as _, index}
					<tr class="hover:bg-gray-100">
						<td class="py-2 px-4 border">{index + 1}</td>
						<td class="py-2 px-4 border">{_.username}</td>
						<td class="py-2 px-4 border">{_.full_name}</td>
						<td class="py-2 px-4 border">{_.matrikID}</td>
						<td class="py-2 px-4 border">{_.points}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
