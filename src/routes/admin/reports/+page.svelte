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
					<th class="py-2 px-4 border">Description</th>
					<th class="py-2 px-4 border">Severity</th>
					<th class="py-2 px-4 border">Images</th>
					<th class="py-2 px-4 border">Status</th>
					<th class="py-2 px-4 border">Options</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each data.reports as _, index}
					<tr class="hover:bg-gray-100">
						<td class="py-2 px-4 border">{index + 1}</td>
						<td class="py-2 px-4 border">{_.description}</td>
						<td class="py-2 px-4 border">{_.severity}</td>
						<td class="py-2 px-4 border">
							{#each _.images as childnode, index}
								<div class="flex flex-col">
									<p class="text-sm font-medium">Image {index + 1}</p>
									<div class="">
										<img
											width="200"
											src={supabase.storage.from('').getPublicUrl(childnode).data.publicUrl}
											alt="gmabnar"
										/>
									</div>
								</div>
							{/each}
						</td>
						<td class="py-2 px-4 border">{_.status}</td>
						<td class="py-2 px-4 border">
							<div class="flex flex-col">
								<button
									on:click={async () => {
										await supabase.from('reports').delete().eq('id', _.id);
										invalidate('admin:reports');
									}}
									class="border border-orange-500 bg-red p-2">Remove</button
								>
								<button
									on:click={async () => {
										await supabase.from('reports').update({ status: 'complete' }).eq('id', _.id);
										invalidate('admin:reports');
									}}
									class="border border-orange-500 p-2">Mark Complete</button
								>
								<button
									on:click={async () => {
										await supabase.from('reports').update({ status: 'pending' }).eq('id', _.id);
										invalidate('admin:reports');
									}}
									class="border border-orange-500 p-2">Mark pending</button
								>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
