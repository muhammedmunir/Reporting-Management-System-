<script lang="ts">
	import type { PageData } from './$types';
    import Sectionwrapper from './component/sectionwrapper.svelte';
    import Headers from './component/header.svelte';

	export let data: PageData;
	let user_profile = data.user_profile;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<Sectionwrapper>
    <Headers { data } />
    <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
        <h2 class="text-1xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Welcome Student, {user_profile.username}</h2>
    </div>
</Sectionwrapper>
