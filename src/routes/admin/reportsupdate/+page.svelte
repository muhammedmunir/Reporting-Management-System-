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

	const handlereportdetail = async (report_id: any) => {
		goto(`/admin/reportsupdate/${report_id}`);
	};
</script>

<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/admin">
            <h1 class="font-semibold">UTM<span class="text-indigo-400">Complaint</span></h1>
        </a>
        <button class="md:hidden grid place-items-center">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav class="md:flex items-center gap-4 lg:gap-6">
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/reports">New Reports</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/reportsupdate">Update Reports</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/complete">Completed Reports</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/students">Ranking Students</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/contractors">Ranking Contractors</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/coupons">List Coupons</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/register-contractor">Contractor Register</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/profile">Profile</a>
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<main class="max-w-6xl mx-auto mt-12 px-4">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">Update Reports</p>
			<p class="text-sm font-semibold pb-5">Total : {data.reports?.length}</p>
		</div>
	</div>
	<div class="overflow-x-auto">
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
							<div class="flex flex-col mb-3">
								{#if _.status == 'in progress' || _.status == 'done progress'}
								<button
									on:click={() => handlereportdetail(_.report_id)}
									class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none sm:px-20"
									>Detail</button
								>
								{:else}
									<button 
										disabled
										class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none sm:px-20"
									>
										Detail
									</button>
								{/if}
							</div>
							<div class="flex flex-col">
								{#if _.status == 'search contractor'}
									<button 
										on:click={async () => {
											await supabase.from('reports').delete().eq('id', _.id);
											invalidate('student:reports');
										}}
										class="border border-red-500 hover:border-red-700 bg-red p-2"
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
							<!--<div class="flex flex-col mb-3">
								<button
									on:click={async () => {
										await supabase.from('reports').update({ status: 'complete' }).eq('id', _.id);
										invalidate('admin:reports');
									}}
									class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none sm:px-20">Confirm</button
								>
							</div>
							<div class="flex flex-col">							
								<button
									on:click={async () => {
										await supabase.from('reports').delete().eq('id', _.id);
										invalidate('admin:reports');
									}}
									class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded focus:outline-none sm:px-20">Cancel</button
								>
							</div>-->
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
