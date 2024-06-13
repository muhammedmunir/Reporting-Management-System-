<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    let isStudent = false;
    let isLoading = true;
    let pathStartsWithStudent = false;

    // Update the component state based on the data
    $: {
        if (data.user_profile) {
            isStudent = data.user_profile.role === 'student';
            isLoading = false;
        }
    }

    // Check if the path starts with "/admin"
    $: pathStartsWithStudent = get(page).url.pathname.startsWith('/student');
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    {#if pathStartsWithStudent}
        {#if isStudent}
            <!--<p>Welcome, student!</p>-->
            <slot />
        {:else}
            <p>You are not an student.</p>
        {/if}
    {:else}
        <p>This path is not restricted to student.</p>
    {/if}
{/if}
