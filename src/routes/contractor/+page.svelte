<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<p>Welcome Contractor</p>

<div class="p-3 text-2xl font-bold flex flex-col">
	<a href="/contractor/reports">View Reports</a>
	<a href="/contractor/taken-reports">Taken Reports</a>
	<a href="/contractor/ranking">Ranking</a>
</div>
