<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Button from '$lib/components/ui/button/button.svelte';
	export let data: SuperValidated<Infer<FormSchema>>;
	const form = superForm(data, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="parent_name">
		<Form.Control let:attrs>
			<Form.Label>Parent's Name</Form.Label>
			<Input {...attrs} bind:value={$formData.parent_name} />
		</Form.Control>
		<Form.Description>Name of Parent/Guardian</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="relationship">
		<Form.Control let:attrs>
			<Form.Label>Child's Relationship</Form.Label>
			<Input {...attrs} bind:value={$formData.relationship} />
		</Form.Control>
		<Form.Description>Relationship with the child Ex. Parent/Guardian</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="number_meals">
		<Form.Control let:attrs>
			<Form.Label>Number of Meals</Form.Label>
			<Input {...attrs} bind:value={$formData.number_meals} />
		</Form.Control>
		<Form.Description>Amount of meals to be sent</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<p class="font-bold text-xl pb-2 pt-1">Child Information</p>
	{#each $formData.children as childnode, index (index)}
		<div
			class="border border-gray-400 px-4 rounded-lg m-2"
			transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'y' }}
		>
			<div
				class="border border-t-0 border-l-0 border-r-0 border-b-gray-300 flex flex-row justify-between"
			>
				<p class="p-2 font-bold text-md">Child {index + 1} Information</p>
				<button
					on:click={(event) => {
						event.preventDefault();
						if ($formData.children.length > 1) {
							// Create a new array excluding the current index node
							const updatedChildren = $formData.children.filter((_, idx) => idx !== index);
							$formData.children = updatedChildren;
						} else {
							alert('Cannot remove the only object.');
						}
					}}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</button>
			</div>
			<Form.Field {form} name="children">
				<Form.Control let:attrs>
					<Form.Label>Child's Name</Form.Label>
					<Input {...attrs} bind:value={childnode.child_name} />
				</Form.Control>
				<Form.Description>Full name as per IC</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="children">
				<Form.Control let:attrs>
					<Form.Label>Class</Form.Label>
					<Input {...attrs} bind:value={childnode.class} />
				</Form.Control>
				<Form.Description>Example M1 Aspen</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	{/each}
	<Button
		class="w-full bg-transparent border text-black hover:bg-gray-500 hover:text-gray-50"
		on:click={(event) => {
			event.preventDefault();
			$formData.children = [...$formData.children, { child_name: '', class: '' }];
		}}>Add another child</Button
	>
	<div class="text-center pt-10">
		<Form.Button class="w-full">Submit</Form.Button>
	</div>
</form>
