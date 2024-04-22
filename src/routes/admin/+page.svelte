<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<p>Welcome Admin</p>

<div class="p-3 text-2xl font-bold flex flex-col">
	<a href="/admin/reports">View Reports</a>
	<a href="/admin/award-points">Award Points</a>
	<a href="/admin/students">View Students</a>
	<a href="/admin/contractors">View Contractors</a>
</div>
