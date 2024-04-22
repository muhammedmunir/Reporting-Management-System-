<script>
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data;

	const STUDENT_STATES = {
		NOT_FOUND: 'NOT_FOUND',
		TAKEN: 'TAKEN',
		FOUND: 'FOUND'
	};

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let scanning = false;

	let scannedText = '';

	let html5Qrcode;

	let studentInfo;

	let studentState = null; // Initialize with null state

	onMount(init);

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	function start() {
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 }
			},
			onScanSuccess,
			onScanFailure
		);
		scanning = true;
	}

	async function stop() {
		await html5Qrcode.stop();
		scanning = false;
	}

	function onScanSuccess(decodedText, decodedResult) {
		scannedText = decodedText;
	}

	function onScanFailure(error) {
		// console.warn(`Code scan error = ${error}`);
	}

	$: if (scannedText !== '') {
		checkstudentExists();
	}

	async function checkstudentExists() {
		if (!browser) return; //ONLY CLIENT SIDE!!!!

		const { data } = await supabase
			.from(`meal_parent`)
			.select(`*`)
			.eq('qrcode', scannedText)
			.maybeSingle();

		if (data) {
			if (data?.taken) {
				studentState = STUDENT_STATES.TAKEN;
			} else {
				studentState = STUDENT_STATES.FOUND;
				studentInfo = data;
			}
		} else {
			studentState = STUDENT_STATES.NOT_FOUND;
		}
	}

	const handleMarkFood = async () => {
		const currentDate = new Date().toISOString().split('T')[0];
		const { error } = await supabase
			.from(`meal_parent`)
			.update({ taken: true })
			.eq('qrcode', scannedText);
		if (error) {
			alert('fail to mark student');
		} else {
			scannedText = '';
			studentInfo = null;
			studentState = null;
		}
	};
</script>

<main>
	<reader id="reader" />

	{#if studentState === STUDENT_STATES.TAKEN}
		<div class="bg-red-300">
			<p class="px-4 p-2 font-bold rounded-md">Student has Taken Food</p>
		</div>
	{:else if studentState === STUDENT_STATES.FOUND}
		<div class="bg-base-300">
			<p class="px-4 p-2 font-bold rounded-md">Parent Name: {studentInfo?.parent_name}</p>
			<p class="px-4 p-2 font-bold rounded-md">Number of Meals : {studentInfo?.number_meals}</p>
			<p class="px-4 p-2 font-bold rounded-md">Students:</p>
			{#each studentInfo?.children as childnode}
				<div class="flex flex-col pb-1 px-4">
					<p class="text-sm font-medium">{childnode.child_name}</p>
					<p class="text-sm text-gray-500">{childnode.class}</p>
				</div>
			{/each}
			<button
				class="border border-orange-300 text-orange-800 rounded-md p-1 px-3 font-bold bg-orange-50 w-full"
				on:click={handleMarkFood}>Mark Food Taken</button
			>
		</div>
	{:else if studentState === STUDENT_STATES.NOT_FOUND}
		<div class="bg-red-300">
			<p class="px-4 p-2 font-bold rounded-md">Parent not found</p>
		</div>
	{/if}

	{#if scanning}
		<div class="flex flex-col">
			<p class="text-sm font-semibold">StudentID</p>
			<input
				class="input input-primary"
				bind:value={scannedText}
				placeholder="Input StudentID Manually"
			/>

			<button class="px-4 bg-red-500 text-white p-2 mt-36 font-bold rounded-md" on:click={stop}
				>STOP</button
			>
		</div>
	{:else}
		<div class="flex flex-col">
			<button class="px-4 bg-blue-600 text-white p-2 mb-20 font-bold rounded-md" on:click={start}
				>START</button
			>
			<p class="text-sm font-semibold">QR Code</p>
			<input
				class="border border-orange-300 text-orange-700 py-1 px-3 rounded-lg"
				bind:value={scannedText}
				placeholder="Input StudentID Manually"
			/>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
	reader {
		width: 100%;
		min-height: 33.33vh;
		background-color: black;
	}
</style>
