<script lang="ts">
	import type { PageData } from './$types.js';
	import SettingsForm from './settings-form.svelte';
	export let data: PageData;
	import logo1 from '$lib/img/logo1.png';
	import logo2 from '$lib/img/logo2.png';
</script>

<svelte:head>
	<title>Meal Delivery Authorization Form | Sequoia International School</title>
</svelte:head>
<div
	class="bg-fixed bg-no-repeat bg-cover bg-center"
	style="background-image: url({logo2});
"
>
	<div
		class="px-10 py-10 pt-3 mx-auto max-w-[600px] bg-white border border-orange-700 border-t-0 border-b-0"
	>
		<div class="pb-11">
			<img src={logo1} class="pb-3" alt="Sequaia School Logo" />
			<p class="font-bold text-2xl pb-3">Meal Delivery Authorization Form</p>
			<ul class="list-disc pl-5">
				<li class="text-sm mb-2">
					Parents <span class="font-bold">must</span> complete the form to help the school
					<span class="font-bold">monitor the number of meals for their children.</span>
				</li>
				<li class="text-sm mb-2">
					This information <span class="font-bold">ensures accurate meal planning</span> and service
					for all students.
				</li>
				<li class="text-sm mb-2">
					After completing the form, a <span class="font-bold">QR code will be displayed.</span>
				</li>
				<li class="text-sm">
					Save the QR code by taking a <span class="font-bold"
						>screenshot or download the image</span
					>
					and present it to the on-duty guard for verification.
				</li>
			</ul>
			<hr class="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700" />
		</div>
		<SettingsForm data={data.form} />

		<p class="px-8 text-center text-sm text-muted-foreground">
			By clicking submit, you agree to our{' '}
			<a href="/terms" class="underline underline-offset-4 hover:text-primary">
				Terms of Service
			</a>{' '}
			and{' '}
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
				Privacy Policy
			</a>
			.
		</p>
	</div>
</div>
