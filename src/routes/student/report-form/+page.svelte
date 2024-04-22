<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types.js';

	export let data: PageData;
	import logo1 from '$lib/img/logo1.png';
	import { goto } from '$app/navigation';

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let description = '';
	let severity = '';
	let images: FileList | null = null;

	const handleSubmit = async () => {
		// Ensure all required fields are filled
		if (!description || !severity || !images) {
			console.error('Please fill all required fields');
			return;
		}

		// Convert severity to number
		const severityNumber = parseInt(severity);

		// Upload images to Supabase Storage
		const imageFiles = Array.from(images);
		const imageUrls = await Promise.all(
			imageFiles.map(async (file, index) => {
				const { data, error } = await supabase.storage
					.from('reports')
					.upload(Date.now().toString() + index, file);
				if (error) {
					console.error('Error uploading image:', error.message);
					return null;
				}
				return data;
			})
		);
		function extractFullPath(data) {
			return data.map((item) => item.fullPath);
		}
		// Insert report into 'reports' table
		const { data: insertedReport, error } = await supabase.from('reports').insert([
			{
				description,
				severity: severityNumber,
				images: extractFullPath(imageUrls),
				owner: session?.user.id
			}
		]);

		if (error) {
			console.error('Error inserting report:', error.message);
			return;
		}

		console.log('Report submitted successfully:', insertedReport);
		goto('/student/form-reports');
		// Clear form fields
		description = '';
		severity = '';
		images = null;
	};
</script>

<svelte:head>
	<title>Report Form | KDSE Report Management System</title>
</svelte:head>

<div
	class="px-10 py-10 pt-3 mx-auto max-w-[600px] bg-white border border-orange-700 border-t-0 border-b-0"
>
	<div class="pb-11">
		<img src={logo1} class="pb-3" alt="Sequaia School Logo" />
		<p class="font-bold text-2xl pb-3">Report Form</p>
		<ul class="list-disc pl-5">
			<li class="text-sm mb-2">Fill the form to report</li>
		</ul>
		<hr class="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700" />
	</div>

	<form on:submit|preventDefault={handleSubmit}>
		<div>
			<label for="description">Description of the Report</label>
			<textarea
				id="description"
				bind:value={description}
				class="block w-full mt-1 border border-orange-300 rounded-md"
				rows="4"
			></textarea>
		</div>
		<div>
			<label for="severity">Severity (1-10)</label>
			<input
				type="number"
				id="severity"
				bind:value={severity}
				class="block w-full mt-1 border border-orange-300 rounded-md"
				min="1"
				max="10"
			/>
		</div>
		<div>
			<label for="images">Images</label>
			<input
				type="file"
				id="images"
				bind:files={images}
				multiple
				accept="image/*"
				class="block w-full mt-1"
			/>
		</div>
		<button type="submit" class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
			>Submit</button
		>
	</form>

	<p class="px-8 text-center text-sm text-muted-foreground">
		By clicking submit, you agree to our{' '}
		<a href="/terms" class="underline underline-offset-4 hover:text-primary">Terms of Service</a
		>{' '}
		and{' '}
		<a href="/privacy" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
	</p>
</div>
