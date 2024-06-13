<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

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
    <h1 class="text-center text-3xl font-bold mb-4">Welcome Admin, {user_profile.username}</h1>
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <div class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <div class="mb-4">
            <h2 class="text-2xl font-semibold mb-4">Status Reports</h2>
            <table class="w-full border-collapse">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="text-center py-auto px-auto border">Pending</th>
                        <th class="text-center py-auto px-auto border">Search Contractor</th>
                        <th class="text-center py-auto px-auto border">In Progress</th>
                        <th class="text-center py-auto px-auto border">Done Progress</th>
                        <th class="text-center py-auto px-auto border">Complete</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr class="hover:bg-gray-100">
                        <td class="text-center py-auto px-auto border">{statusCounts.pending}</td>
                        <td class="text-center py-auto px-auto border">{statusCounts['search contractor']}</td>
                        <td class="text-center py-auto px-auto border">{statusCounts['in progress']}</td>
                        <td class="text-center py-auto px-auto border">{statusCounts['done progress']}</td>
                        <td class="text-center py-auto px-auto border">{statusCounts.complete}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-4">
            <h2 class="text-2xl font-semibold mb-4">Contractor Apply</h2>
            <table class="w-full border-collapse">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="text-center py-auto px-auto border">No.</th>
                        <th class="text-center py-auto px-auto border">Email</th>
                        <th class="text-center py-auto px-auto border">Name</th>
                        <th class="text-center py-auto px-auto border">No. Phone</th>
                        <th class="text-center py-auto px-auto border">Apply At</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    {#each contractors as contractor, index}
                        <tr class="hover:bg-gray-100">
                            <td class="text-center py-auto px-auto border">{index + 1}</td>
                            <td class="text-center py-auto px-auto border">{contractor.email}</td>
                            <td class="text-center py-auto px-auto border">{contractor.fullname}</td>
                            <td class="text-center py-auto px-auto border">{contractor.phone_number}</td>
                            <td class="text-center py-auto px-auto border">{formatDate(contractor.create_at)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="mb-4">
            <h2 class="text-2xl font-semibold mb-4">Claimed Coupons</h2>
            <table class="w-full border-collapse">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="text-center py-auto px-auto border">No.</th>
                        <th class="text-center py-auto px-auto border">Name</th>
                        <th class="text-center py-auto px-auto border">Arked</th>
						<th class="text-center py-auto px-auto border">Description</th>
                        <th class="text-center py-auto px-auto border">Claimed At</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    {#each claimed_coupons as coupon, index}
                        <tr class="hover:bg-gray-100">
                            <td class="text-center py-auto px-auto border">{index + 1}</td>
                            <td class="text-center py-auto px-auto border">{coupon.profiles.username}</td>
                            <td class="text-center py-auto px-auto border">{coupon.coupons.title}</td>
							<td class="text-center py-auto px-auto border">{coupon.coupons.description}</td>
                            <td class="text-center py-auto px-auto border">{formatDate(coupon.claimed_at)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</section>
