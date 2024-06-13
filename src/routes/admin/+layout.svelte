<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    let isAdmin = false;
    let isLoading = true;
    let pathStartsWithAdmin = false;

    // Update the component state based on the data
    $: {
        if (data.user_profile) {
            isAdmin = data.user_profile.role === 'admin';
            isLoading = false;
        }
    }

    // Check if the path starts with "/admin"
    $: pathStartsWithAdmin = get(page).url.pathname.startsWith('/admin');
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    {#if pathStartsWithAdmin}
        {#if isAdmin}
            <!--<p>Welcome, admin!</p>-->
            <slot />
        {:else}
            <p>You are not an admin.</p>
        {/if}
    {:else}
        <p>This path is not restricted to admins.</p>
    {/if}
{/if}
