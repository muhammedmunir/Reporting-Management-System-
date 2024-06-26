<script lang="ts">
    import { goto } from '$app/navigation';
    import { openModal } from '../../store';
    import type { PageData } from './$types';

	export let data: PageData;
    let { supabase, session } = data;
	$: ({ supabase, session } = data);

    let y;
	$: outerHeight = 0;

	function reroute(href) {
		$openModal = false;
		window.location.href = href;
	};

    const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};
</script>

{#if $openModal}
<div class="fixed top-0 left-0 w-screen h-screen border-0 bg-white z-50 flex flex-col gap-8 p-5 px-8 md:hidden">
    <div class="flex items-center justify-between gap-4 border-b pb-2">
        <h1 class="font-semibold">UTM<span class="text-red-700">Complaint</span></h1>
        <button on:click={ () => ($openModal = false) } class="outline-none border-none">
            <i class="fa-solid fa-xmark text-2xl"></i>
        </button>
    </div>
    <div class="flex flex-col gap-4 flex-1">
        <button on:click={ () => reroute("/admin/reports")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">New Reports <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/admin/reportsupdate")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">Update Reports <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/admin/complete")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">Completed Reports <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/admin/users")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">List Users <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/admin/coupons")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">List Coupons <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/admin/register-contractor")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">Contractor Register <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/admin/profile")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">Profile <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
    </div>
    <div class="flex items-center gap-4 flex-1 flex-col">
        <button on:click={handleSignOut} class="specialBtn">
            <p class="text-base sm:text-lg md:text-xl">Logout</p>
        </button>
    </div>
</div>
{/if}

{#if y > outerHeight}
<div class="bg-white fixed top-0 left-0 w-full flex flex-col z-20 px-4 fadeIn">
    <header class="flex flex-col relative z-20">
        <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
            <a href="/admin">
                <h1 class="font-semibold">UTM<span class="text-red-700">Complaint</span></h1>
            </a>
            <button on:click={ () => ($openModal = true) } class="md:hidden grid place-items-center">
                <i class="fa-solid fa-bars" />
            </button>
            <nav class="hidden md:flex items-center gap-4 lg:gap-6">
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/reports">New Reports</a>
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/reportsupdate">Update Reports</a>
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/complete">Completed Reports</a>
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/users">List Users</a>
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/coupons">List Coupons</a>
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/register-contractor">Contractor Register</a>
                <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/profile">Profile</a>
                <button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
            </nav>
        </div>
    </header>
</div>
{/if}

<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/admin">
            <h1 class="font-semibold">UTM<span class="text-red-700">Complaint</span></h1>
        </a>
        <button on:click={ () => ($openModal = true) } class="md:hidden grid place-items-center">
            <i class="fa-solid fa-bars" />
        </button>
        <nav class="hidden md:flex items-center gap-4 lg:gap-6">
            <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/reports">New Reports</a>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/reportsupdate">Update Reports</a>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/complete">Completed Reports</a>
            <a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/users">List Users</a>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/coupons">List Coupons</a>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/register-contractor">Contractor Register</a>
			<a class="duration-200 hover:text-red-400 cursor-pointer" href="/admin/profile">Profile</a>
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<svelte:window bind:scrollY={y} bind:outerHeight />