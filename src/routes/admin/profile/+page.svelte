<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;
    let user_profile = data.user_profile;
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
    <!-- Display User Profile Information -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-2">Profile Information</h2>
        <p>Name: {user_profile.username}</p>
        <p>No. Matric: {user_profile.matrikID}</p>
        <!-- You can add more profile fields here -->
    </div>
</main>

<section class={"min-h-screen flex flex-col px-4"}>
    <div class="flex flex-col flex-1 max-w-[1400px] mx-auto w-full">
        <slot/>
    </div>
</section>