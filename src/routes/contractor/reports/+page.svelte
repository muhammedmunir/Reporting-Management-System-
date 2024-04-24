<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};
</script>

<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/contractor">
            <h1 class="font-semibold">UTM<span class="text-indigo-400">Complaint</span></h1>
        </a>
        <button class="md:hidden grid place-items-center">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav class="md:flex items-center gap-4 lg:gap-6">
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/contractor/reports">View Reports</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/contractor/taken-reports">Taken Reports</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/contractor/ranking">View Ranking</a>
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<main class="max-w-4xl mx-auto mt-12 px-4">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">Avaible Reports</p>
			<p class="text-sm font-semibold pb-5">Total : {data.reports?.length}</p>
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
										await supabase
											.from('reports')
											.update({ status: 'in progress', handleby: session?.user.id })
											.eq('id', _.id);
										invalidate('admin:reports');
									}}
									class="border border-orange-500 bg-red p-2">Take Job</button
								>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <dev class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <slot/>
    </dev>
</section>
