<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let reports = data.reports;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
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

<main class="max-w-4xl mx-auto mt-12 px-4">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">View Students</p>
			<p class="text-sm font-semibold pb-5">Total : {data.reports?.length}</p>
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
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <dev class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <slot/>
    </dev>
</section>
