<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	// Stores
	import { modalStore } from "@skeletonlabs/skeleton";
	// Form Data
	const formData = {
		isbn: '',
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		$modalStore[0].response(formData);
		modalStore.close();
	}
	// Base Classes
	const cBase: string = 'space-y-4';
	const cForm: string = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<div class="isbn-form {cBase}">
	<!-- Enable for debugging: -->
	<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
	<form class="isbn-modal-form {cForm}">
		<label>
			<span>ISBN</span>
			<input type="text" bind:value={formData.isbn} placeholder="Enter book ISBN..." />
		</label>
	</form>
	<!-- prettier-ignore -->
	<footer class="isbn-modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit</button>
    </footer>
</div>