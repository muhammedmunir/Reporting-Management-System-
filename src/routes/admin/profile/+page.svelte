<script lang="ts">
    import type { PageData } from './$types';
	import Sectionwrapper from '../component/sectionwrapper.svelte';
    import Headers from '../component/header.svelte';

    export let data: PageData;
    let user_profile = data.user_profile;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 w-full">
        <h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Profile Information</h2>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
            <div class="mb-2">
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Username:</p>
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{user_profile.username}</p>
            </div>
            <div class="mb-2">
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Full Name:</p>
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{user_profile.full_name}</p>
            </div>
            <div class="mb-2">
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Email:</p>
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{user_profile.email}</p>
            </div>
            <div class="mb-2">
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Phone:</p>
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{user_profile.phone}</p>
            </div>
            <div class="mb-2">
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Matric:</p>
                <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center">{user_profile.matrikID}</p>
            </div>
        </form>
    </div>
</Sectionwrapper>