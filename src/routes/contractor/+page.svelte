<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import Sectionwrapper from './component/sectionwrapper.svelte';
    import Headers from './component/header.svelte';
    import takejob from '$lib/img/takejob.png';
    import updatejob from '$lib/img/updatejob.png';

    export let data: PageData;
    let user_profile = data.user_profile;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

	const handletakejob = async () => {
		await goto('/contractor/reports');
	};

    const handleupdatejob = async () => {
		await goto('/student/taken-reports');
	};
</script>

<Sectionwrapper>
    <Headers {data} />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
        <h3 class="text-1xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Welcome Contractor, {user_profile.username}</h3>

        <div>
			<div class="mb-2">
            	<h3 class="text-1xl sm:text-2xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">About:</h3>
            </div>
			<p class="text-1xl sm:text-1xl md:text-1xl text-center max-w-[1000px] mx-auto w-full">The System Defect Management System (SDMS) is designed to streamline the process of managing defects and tasks. Contractors can easily take jobs, update their progress, and ensure timely completion of tasks.</p>
        </div>

        <div>
			<div class="mb-2">
            <h3 class="text-1xl sm:text-2xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">System Features:</h3>
            </div>
			<ul>
				<li class="text-1xl sm:text-1xl md:text-1xl text-center max-w-[1000px] mx-auto w-full"><strong>Take Job:</strong> View and accept available jobs.</li>
				<li class="text-1xl sm:text-1xl md:text-1xl text-center max-w-[1000px] mx-auto w-full"><strong>Update Job:</strong> Update the progress and mark jobs as completed.</li>
			</ul>
		</div>

        <div>
			<div class="mb-2">
            <h4 class="text-1xl sm:text-2xl md:text-2xl lg:text-2xl max-w-[1200px] mx-auto w-full text-center font-semibold">Get Started Now!</h4>
			</div>
			<div class="flex gap-4 justify-center">
                <button class="specialBtnDark hover:bg-red-900" on:click={ handletakejob }>Take a Job</button>
                <button class="specialBtn" on:click={ handleupdatejob }>Update Job</button>
            </div>
        </div>

        <div class="flex gap-4 justify-center">
            <img src={takejob} alt="Illustration of taking a job" class=" w-28" />
            <img src={updatejob} alt="Illustration of updating a job" class=" w-28" />
        </div>
    </div>
</Sectionwrapper>