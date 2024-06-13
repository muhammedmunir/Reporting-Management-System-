<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    let isContactor = false;
    let isLoading = true;
    let pathStartsWithContactor = false;

    // Update the component state based on the data
    $: {
        if (data.user_profile) {
            isContactor = data.user_profile.role === 'contractor';
            isLoading = false;
        }
    }

    // Check if the path starts with "/admin"
    $: pathStartsWithContactor = get(page).url.pathname.startsWith('/contractor');
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    {#if pathStartsWithContactor}
        {#if isContactor}
            <!--<p>Welcome, contractor!</p>-->
            <slot />
        {:else}
            <p>You are not an contractor.</p>
        {/if}
    {:else}
        <p>This path is not restricted to contractor.</p>
    {/if}
{/if}
