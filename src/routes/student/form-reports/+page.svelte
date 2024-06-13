<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	let reports = data.reports;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};

	const handlereportdetail = async (id: any) => {
		goto(`/student/form-reports/${id}`);
	};

	const handlereportupdate = async (id: any) => {
		goto(`/student/edit-report/${id}`);
	};
</script>

<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/student">
            <h1 class="font-semibold">UTM<span class="text-indigo-400">Complaint</span></h1>
        </a>
        <button class="md:hidden grid place-items-center">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav class="md:flex items-center gap-4 lg:gap-6">
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/report-form">Make Report</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/form-reports">View Reports</a>
            <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/ranking">View Ranking</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/coupons">Shop Coupon</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/coupon">My Coupon</a>
			<a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/student/profile">Profile</a>
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<main class="max-w-4xl mx-auto mt-12 px-4">
	<div class="flex flex-row justify-between">
		<div>
			<p class="font-bold text-2xl">Your Reports</p>
			<p class="text-sm font-semibold pb-5">Total : {reports?.length}</p>
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
								<!--<button 
										on:click={async () => {
											await supabase.from('reports').delete().eq('id', _.id);
											invalidate('student:reports');
										}}
										class="border border-red-500 hover:border-red-700 bg-red p-2"
									>
										Edit
									</button>-->
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
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <dev class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <slot/>
    </dev>
</section>
