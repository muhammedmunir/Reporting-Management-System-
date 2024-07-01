<script lang="ts">
    import type { PageData } from './$types';
    import Sectionwrapper from './component/sectionwrapper.svelte';
    import Headers from './component/header.svelte';
    import { goto } from '$app/navigation';
    import makereport from '$lib/img/makereport.png';
    import viewreport from '$lib/img/viewreport.png'; 

    export let data: PageData;
    let user_profile = data.user_profile;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    const handlemakereport = async () => {
		await goto('/student/report-form');
	};

    const handleviewreport = async () => {
		await goto('/student/form-reports');
	};
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
        <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Welcome Student, {user_profile.username}</h3>

        <div>
            <div class="mb-2">
                <h3 class="text-xl sm:text-2xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">About:</h3>
            </div>
            <p class="text-1xl sm:text-2xl md:text-2xl text-center max-w-[1000px] mx-auto w-full">A system designed to help students report and manage complaints efficiently. Our goal is to create a better campus environment by addressing issues promptly and effectively.</p>
        </div>

        <div>
            <div class="mb-2">
                <h3 class="text-xl sm:text-2xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">System Features:</h3>
            </div>
            <ul>
                <li class="text-1xl sm:text-1xl md:text-1xl text-center max-w-[1000px] mx-auto w-full"><strong>Make Report:</strong> Submit your complaints and issues easily.</li>
                <li class="text-1xl sm:text-1xl md:text-1xl text-center max-w-[1000px] mx-auto w-full"><strong>View Reports:</strong> Track the status of your submitted reports.</li>
                <li class="text-1xl sm:text-1xl md:text-1xl text-center max-w-[1000px] mx-auto w-full"><strong>Shop Coupon:</strong> Earn and use coupons for various benefits.</li>
            </ul>
        </div>

        <div>
            <div class="mb-2">
                <h4 class="text-xl sm:text-2xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">Get Started Now!</h4>
            </div>
            <div class="flex gap-4 justify-center">
                <button class="specialBtnDark hover:bg-red-900" on:click={handlemakereport}>Make a Report</button>
                <button class="specialBtn" on:click={handleviewreport}>View Reports</button>
            </div>
        </div>

        <div class="flex gap-4 justify-center">
            <img src={makereport} alt="Illustration of reporting" class=" w-28" />
            <img src={viewreport} alt="Illustration of tracking reports" class=" w-28" />
        </div>
    </div>
</Sectionwrapper>
