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
		genre: '',
		pubDate: '',
		copies: 0
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
	// Base Classes
	const cBase: string = 'space-y-4';
	const cForm: string = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	function onNextHandler(e: any): void {
		console.log('event:next', e.detail);
	}
	function onBackHandler(e: any): void {
		console.log('event:prev', e.detail);
	}
	function onCompleteHandler(e: any): void {
		console.log('event:complete', e.detail);
		alert('Complete!');
	}
</script>

<!-- <Stepper on:next={onNextHandler} on:back={onBackHandler} on:complete={onCompleteHandler}>
	<Step>
		<svelte:fragment slot="header">Required</svelte:fragment>
		<input class="input" id="title" type="text" placeholder="Title"/>
		<input class="input" id="author" type="text" placeholder="Author"/>
		<input class="input" id="genre" type="text" placeholder="Genre"/>
		<input class="input" id="pubDate" type="text" placeholder="Publication Date"/>
	</Step>
	<Step>
		<svelte:fragment slot="header">Optional</svelte:fragment>
		<textarea class="textarea" id="description" rows="3" placeholder="Description..."/>
		<input class="input" id="pageCount" type="text" placeholder="Page Count"/>
		<input class="input" id="imageLink" type="text" placeholder="Image Link"/>
		<input class="input" id="publisher" type="text" placeholder="Publisher"/>
		<input class="input" id="language" type="text" placeholder="Language"/>
	</Step>
</Stepper> -->

<div class="modal-example-form {cBase}">
	<form class="modal-form {cForm}">
		<label>
			<span>Title</span>
			<input type="text" bind:value={formData.title} placeholder="Enter title..." required/>
		</label>
		<label>
			<span>Author</span>
			<input type="text" bind:value={formData.author} placeholder="Enter author..." required/>
		</label>
		<label>
			<span>Genre</span>
			<input type="text" bind:value={formData.genre} placeholder="Enter genre..." required/>
		</label>
		<label>
			<span>Publication Date</span>
			<input type="text" bind:value={formData.pubDate} placeholder="Enter publication date..." required/>
		</label>
		<label>
			<span>Copies in Stock</span>
			<input type="number" bind:value={formData.copies} placeholder="Enter number of copies..." required/>
		</label>
	</form>
	<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
</div>