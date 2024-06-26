<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	let coupons = data.coupons;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let currentPage = 1;
	const rowsPerPage = 5;

	function reroute(href) {
		window.location.href = href;
	};

	const handleedit = async (id: any) => {
		goto(`/admin/coupons/${id}`);
	};

	function nextPage() {
		if (currentPage < Math.ceil(coupons.length / rowsPerPage)) {
			currentPage += 1;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage -= 1;
		}
	}

	$: data.coupons = coupons.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
		<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">List Coupons</h2>
		<div class="overflow-x-auto w-full">
			<div class="flex flex-row justify-between w-full">
				{#if coupons?.length > 0}
				<div class="mb-4 md:mb-0">
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Total : {coupons?.length}</p>
				</div>
				{/if}
				<div class="p-2">
					<button on:click={ () => reroute("/admin/coupon")} class="specialBtnDark hover:bg-red-900"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Create Coupon</p></button>
				</div>
			</div>
			{#if coupons?.length > 0}
				<table class="w-full border-collapse">
					<thead class="bg-gray-200">
						<tr>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Arked</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Food or Drink</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Quantity</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">price</p></th>
							<th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Options</p></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.coupons as _, index}
							<tr class="hover:bg-gray-100">
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.title}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.description}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.quantity}</p></td>
								<td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{_.price}</p></td>
								<td class="py-2 px-4 border text-center">
									<div class="flex flex-col mb-2">
										<button
											on:click={() => handleedit(_.id)}
											class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20"
											><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">Edit</p></button
										>
									</div>
								</td>						
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="flex justify-between mt-4">
					<button on:click={previousPage} disabled={currentPage === 1} class="specialBtnDark hover:bg-red-900">
						&larr;
					</button>
					<p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w/[1200px] mx-auto w/full font-semibold">Page {currentPage} of {Math.ceil(coupons.length / rowsPerPage)}</p>
					<button on:click={nextPage} disabled={currentPage === Math.ceil(coupons.length / rowsPerPage)} class="specialBtnDark hover:bg-red-900">
						&rarr;
					</button>
				</div>
			{:else}
			<p class="text-12l sm:text-1xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">No available coupon</p>
			{/if}
		</div>
	</div>
</Sectionwrapper>
