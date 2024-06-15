import { writable } from 'svelte/store';
import type { PageLoad } from './$types';

export const openModal = writable(false)