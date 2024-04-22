<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let parents = data.parents;
</script>

<div class="p-2">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">List of Parents and their child</p>
			<p class="text-sm font-semibold pb-5">Total : {parents?.length}</p>
		</div>
		<div class="p-2">
			<a class="border border-orange-400 p-2 rounded-md bg-orange-50 text-orange-800" href="/scan"
				>SCAN</a
			>
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="py-2 px-4 border">Taken</th>
					<th class="py-2 px-4 border">Parent Name</th>
					<th class="py-2 px-4 border">Relationship</th>
					<th class="py-2 px-4 border">Number Meals</th>
					<th class="py-2 px-4 border">Students</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each parents as _}
					<tr class="hover:bg-gray-100">
						<td class="py-2 px-4 border {_.taken ? 'bg-green-200' : 'bg-red-200'}"
							>{_.taken ? 'Yes' : 'Not'}</td
						>
						<td class="py-2 px-4 border">{_.parent_name}</td>
						<td class="py-2 px-4 border">{_.relationship}</td>
						<td class="py-2 px-4 border">{_.number_meals}</td>
						<td class="py-2 px-4 border">
							{#each _.children as childnode}
								<div class="flex flex-col">
									<p class="text-sm font-medium">{childnode.child_name}</p>
									<p class="text-sm text-gray-500">{childnode.class}</p>
								</div>
							{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
