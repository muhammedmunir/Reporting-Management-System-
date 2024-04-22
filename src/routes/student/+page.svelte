<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/login', { replaceState: true });
	};
</script>

<p>Welcome Student</p>

<div class="p-3 text-2xl font-bold flex flex-col">
	<a href="/student/report-form">Make Report</a>
	<a href="/student/form-reports">View Reports</a>
	<a href="/student/ranking">View Ranking</a>
</div>

<button on:click={handleSignOut}>Logout</button>
