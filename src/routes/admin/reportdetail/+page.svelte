<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { PageData } from '../reports/$types';

    export let data: PageData;
    let reports = data.reports;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    // Function to handle fetching report data
    const fetchReport = async () => {
        try {
            const response = await fetch(`/api/reportsdetail?reportid=${reports.id}`);
            if (response.ok) {
                const reportData = await response.json();
                reports = reportData.reports;
            } else {
                console.error('Failed to fetch report data');
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    // Call fetchReport when component is mounted
    fetchReport();
</script>

<main class="register flex flex-col justify-center items-center">
    <h1 class="text-3xl font-bold mb-2">Form Report</h1>
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-6">
            <label for="kolej" class="block text-gray-700 text-sm font-bold mb-2">Kolej</label>
            <input disabled id="kolej" type="text" bind:value={reports.kolej} class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline" />
        </div>
        <!-- Add other fields here -->
        <button type="submit" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
        <a class="duration-200 hover:text-indigo-400 cursor-pointer" href="/admin/reports">Cancel</a>
    </form>
</main>