<script lang="ts">
    import { wipeDb, wipeUsers } from '$lib/db';
    import { Settings, updateSettings } from '$lib/stores';
    import { AccordionGroup, AccordionItem } from '@skeletonlabs/skeleton';
    import type { SubmitFunction } from '@sveltejs/kit';
    import { writable } from 'svelte/store';
    import { store } from '../../hooks/auth';
    import { theme } from "$lib/stores";

    function saveSettings() {
        updateSettings([
            (<HTMLInputElement>document.getElementById("libName")).value
            ])
        console.log((<HTMLInputElement>document.getElementById("libName")).value)
    }

    const themes = [
        { type: 'rocket', name: 'Theme 1'},
        { type: 'modern', name: 'Theme 2'}
    ]

	// const setTheme: SubmitFunction = () => {
	// 	return async ({ result, update }) => {
	// 		await update();
	// 		if (result.type === 'success') {
	// 			const newTheme = result.data?.newTheme as string;
	// 			theme.set(newTheme);
	// 		}
	// 	};
	// };

</script>

<div class="container mx-auto p-8 space-y-8">
    <h2>Library Settings</h2>
    <div class="card card-body space-y-4">
        <!-- <TabGroup selected={storeThree} justify="justify-start md:justify-center" borderColor="border-tertiary-500" fill="fill-tertiary-500" color="text-tertiary-500" hover="hover:bg-tertiary-500/10">
            <Tab value="a">
                <svelte:fragment slot="lead">
                </svelte:fragment>
                General
            </Tab>
            <Tab value="b">
                <svelte:fragment slot="lead">
                </svelte:fragment>
                Theme
            </Tab>
            <Tab value="c">
                <svelte:fragment slot="lead">
                </svelte:fragment>
                Other
            </Tab>
        </TabGroup> -->
        <div class="container mx-auto p-8 space-y-8">
            <div class="card card-body space-y-4">
                Library Name <input id="libName">
                <button class="btn variant-filled-primary btn-base" on:click={()=>{saveSettings()}}>Save</button>
                <!-- <button on:click={()=>{setTheme()}} -->
                <br/>
                <AccordionGroup>
                    <AccordionItem>
                        <svelte:fragment slot="summary"><p class="font-bold">Advanced</p></svelte:fragment>
                        <svelte:fragment slot="content">
                            <button class="btn variant-filled-primary" on:click={()=>{wipeDb()}}>Delete All Books</button>
                            <button class="btn variant-filled-primary" on:click={()=>{wipeUsers()}}>Delete All Users</button>
                        </svelte:fragment>
                    </AccordionItem>
                </AccordionGroup>
            </div>
        </div>
    </div>
</div>