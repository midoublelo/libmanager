<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	// Stores
	import { modalStore } from "@skeletonlabs/skeleton";
	// Form Data
	const formData = {
		title: '',
		author: '',
		genre: ''
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
	// Base Classes
	const cBase: string = 'space-y-4';
	const cForm: string = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-example-form {cBase}">
	<!-- Enable for debugging: -->
	<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
	<form class="modal-form {cForm}">
		<label>
			<span>Title</span>
			<input type="text" bind:value={formData.title} placeholder="Enter title..." />
		</label>
		<label>
			<span>Author</span>
			<input type="tel" bind:value={formData.author} placeholder="Enter author..." />
		</label>
		<label>
			<span>Genre</span>
			<input type="email" bind:value={formData.genre} placeholder="Enter genre..." />
		</label>
	</form>
	<!-- prettier-ignore -->
	<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
</div>