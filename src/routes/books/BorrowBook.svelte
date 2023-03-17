<script lang="ts">
    export let parent: any;

    import { db } from '$lib/db';
    import { liveQuery } from 'dexie';
    import { modalStore } from "@skeletonlabs/skeleton";

    const cForm: string = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

    let users = liveQuery(() =>
        db.users
            .orderBy("email")
            .toArray()
        );

    $: userList = $users

    let formData = {
        user: '',
        returnDate: ''
    }

</script>

<div class="{cForm}">
    <form>
        {#if userList !== undefined}
            <label>
                <span>Select User</span>
                <select bind:value={formData.user} on:change={console.log(formData.user)}>
                    {#each userList as user}
                        <option value={user}>
                            {user.email}
                        </option>
                    {/each}
                </select>
            </label>
        {/if}
        <label>
            <span>Return Date</span>
            <input type="date" bind:value={formData.returnDate} />
        </label>
    </form>
	<footer class="isbn-modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit</button>
    </footer>
</div>
