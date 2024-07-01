<script lang="ts">
    import { goto } from '$app/navigation';
    import { openModal } from '../../store';
    import type { PageData } from './$types';

	export let data: PageData;
    let { supabase, session } = data;
	$: ({ supabase, session } = data);

    let y: any;
	$: outerHeight = 0;

	function reroute(href: string) {
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
        <button on:click={ () => reroute("/student/report-form")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">Make Report <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/student/form-reports")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">View Reports <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/student/coupons")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">Shop Coupon <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/student/coupon")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
            <p class="duration-200 group-hover:pl-2 poppins text-2xl font-semibold">My Coupon <i class="fa-solid fa-chevron-right text-xl pl-4" /></p>
        </button>
        <button on:click={ () => reroute("/student/profile")} class="border-none outline-none p-2 group duration-200 cursor-pointer text-left">
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
            <a href="/student">
                <h1 class="font-semibold">UTM<span class="text-red-700">Complaint</span></h1>
            </a>
            <button on:click={ () => ($openModal = true) } class="md:hidden grid place-items-center">
                <i class="fa-solid fa-bars" />
            </button>
            <nav class="hidden md:flex items-center gap-4 lg:gap-6">
                <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/report-form">Make Report</a>
                <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/form-reports">View Reports</a>
                <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/coupons">Shop Coupon</a>
                <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/coupon">My Coupon</a>
                <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/profile">Profile</a>
                <button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
            </nav>
        </div>
    </header>
</div>
{/if}

<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/student">
            <h1 class="font-semibold">UTM<span class="text-red-700">Complaint</span></h1>
        </a>
        <button on:click={ () => ($openModal = true) } class="md:hidden grid place-items-center">
            <i class="fa-solid fa-bars" />
        </button>
        <nav class="hidden md:flex items-center gap-4 lg:gap-6">
            <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/report-form">Make Report</a>
			<a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/form-reports">View Reports</a>
            <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/coupons">Shop Coupon</a>
            <a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/coupon">My Coupon</a>
			<a class="duration-200 hover:text-red-700 cursor-pointer" href="/student/profile">Profile</a>
			<button class="specialBtn" on:click={handleSignOut}><p>Logout</p></button>
        </nav>
    </div>
</header>

<svelte:window bind:scrollY={y} bind:outerHeight />