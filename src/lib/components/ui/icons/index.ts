import LoaderCircle from 'lucide-svelte/icons/loader-circle';
import type { SvelteComponent } from 'svelte';
import Google from './google.svelte';

export type Icon = SvelteComponent;

export const Icons = {
	spinner: LoaderCircle,
	google: Google
};
