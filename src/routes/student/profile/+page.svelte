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
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
        <h2 class="text-3xl sm:text-1xl md:text-2xl lg:text-3xl max-w-[1200px] mx-auto w-full text-center font-semibold">Profile Information</h2>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">Name: {user_profile.username}</p>
            <p class="text-1xl sm:text-1xl md:text-1xl lg:text-1xl max-w-[1200px] mx-auto w-full text-center font-semibold">No. Matric: {user_profile.matrikID}</p>
        </form>
    </div>
</Sectionwrapper>