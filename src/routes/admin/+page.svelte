<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
	import Sectionwrapper from './component/sectionwrapper.svelte';
    import Headers from './component/header.svelte';

    export let data: PageData;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let user_profile = data.user_profile;
    let reports = data.reports;
    let statusCounts = data.statusCounts;
    let contractors = data.contractors;
    let claimed_coupons = data.claimed_coupons;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/login', { replaceState: true });
    };

    const formatDate = (dateString: string) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kuala_Lumpur'
        };
        return new Date(dateString).toLocaleString('en-GB', options);
    };
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
        <h2 class="text-1xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Welcome Contractor, {user_profile.username}</h2>
        <div class="overflow-x-auto w-full">
            <div class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">Status Reports</h2>
                <table class="w-full border-collapse">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Pending</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Search Contractor</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">In Progress</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Done Progress</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Complete</p></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="hover:bg-gray-100">
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts.pending}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts['search contractor']}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts['in progress']}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts['done progress']}</p></td>
                            <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{statusCounts.complete}</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">Contractor Apply</h2>
                <table class="w-full border-collapse">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No.</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Email</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Name</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No. Phone</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Apply At</p></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each contractors as contractor, index}
                            <tr class="hover:bg-gray-100">
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.email}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.fullname}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{contractor.phone_number}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{formatDate(contractor.create_at)}</p></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
    
            <div class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">Claimed Coupons</h2>
                <table class="w-full border-collapse">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">No.</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Name</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Arked</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Description</p></th>
                            <th class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full font-semibold">Claimed At</p></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each claimed_coupons as coupon, index}
                            <tr class="hover:bg-gray-100">
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{index + 1}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{coupon.profiles.username}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{coupon.coupons.title}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{coupon.coupons.description}</p></td>
                                <td class="py-2 px-4 border text-center"><p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-fullr">{formatDate(coupon.claimed_at)}</p></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</Sectionwrapper>

