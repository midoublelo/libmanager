<script lang="ts">
    export let parent: any;

   	import { modalStore } from "@skeletonlabs/skeleton";

    const formData = {
        email: '',
    };

    function onFormSubmit(): void {
        if ($modalStore[0].response) $modalStore[0].response(formData);
        modalStore.close();
    }

    const cBase: string = 'space-y-4';
    const cForm: string = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<div class="user-form {cBase}">
    <form class="user-modal-form {cForm}">
		<label>
			<span>Email</span>
			<input type="email" bind:value={formData.email} placeholder="Enter user email..." />
		</label>
    </form>
	<footer class="isbn-modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit</button>
    </footer>
</div>