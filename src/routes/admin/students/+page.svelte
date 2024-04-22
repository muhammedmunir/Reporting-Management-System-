<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="p-2">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">Your Reports</p>
			<p class="text-sm font-semibold pb-5">Total : {data.reports?.length}</p>
		</div>
		<div class="p-2">
			<a
				class="border border-orange-400 p-2 rounded-md bg-orange-50 text-orange-800"
				href="/student/report-form">Make Report</a
			>
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="py-2 px-4 border">No</th>
					<th class="py-2 px-4 border">Name</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each data.reports as _, index}
					<tr class="hover:bg-gray-100">
						<td class="py-2 px-4 border">{index + 1}</td>
						<td class="py-2 px-4 border">{_.username}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
