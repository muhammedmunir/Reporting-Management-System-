<script lang="ts">
	import { Qr } from '@sveltevk/qr';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import html2canvas from 'html2canvas';

	let downloadLink;

	const handleDownload = () => {
		// Select the QR code container
		const qrContainer = document.getElementById('qr-container');

		html2canvas(qrContainer).then((canvas) => {
			// Convert canvas to image data URL
			const imageDataUrl = canvas.toDataURL('image/png');

			// Create a temporary anchor element
			downloadLink.href = imageDataUrl;
			downloadLink.download = `${$page.url.searchParams.get('qrcode')}.png`; // Set the filename for download
			downloadLink.click();
		});
	};

	// Create the download link on component mount
	onMount(() => {
		downloadLink = document.createElement('a');
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
	});

	// Cleanup on component unmount
	onDestroy(() => {
		if (downloadLink && downloadLink.parentNode) {
			downloadLink.parentNode.removeChild(downloadLink);
		}
	});
</script>

<div class="px-3 py-10 mx-auto max-w-[500px]">
	<div class="w-full flex flex-row justify-center pb-2">
		<p class="font-bold text-3xl text-center bg-green-100 text-green-950 rounded-lg px-3 py-1">
			Form Submitted Succesfully!
		</p>
	</div>
	<div class="w-full flex flex-row justify-center pb-4">
		<p class="font-bold text-2xl text-center">Your QR Code is ready</p>
	</div>
	<div id="qr-container" class="p-5">
		<div class="w-full flex flex-row justify-center">
			<Qr text={$page.url.searchParams.get('qrcode')} isShowLogo={true} qrSize={256} />
		</div>

		<div class="w-full flex flex-row justify-center pb-4">
			<p class="font-bold text-sm">{$page.url.searchParams.get('qrcode')}</p>
		</div>

		<p class="font-bold text-md text-center">
			Please show this QR to the on-duty guard for verification.
		</p>
	</div>
	<hr class="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700 mb-2" />
	<p class="font-bold text-md text-center">Screenshot this page or download below</p>
	<div class="flex flex-row justify-center pt-2">
		<button
			class="py-2 px-3 border border-orange-500 hover:bg-orange-500 hover:text-white hover:border-transparent transition duration-300 ease-in-out rounded-md"
			on:click={handleDownload}>Download QR</button
		>
	</div>
	<hr class="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700 mb-2" />
	<p class="font-bold text-xs text-center">If QR code fail to load save the code shown</p>
</div>
