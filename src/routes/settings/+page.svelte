<script lang="ts">
import { Settings, updateSettings } from '$lib/values';
import { TabGroup, Tab } from '@skeletonlabs/skeleton';
import { writable } from 'svelte/store';

let storeThree = writable('a');

function saveSettings() {
    updateSettings([
        (<HTMLInputElement>document.getElementById("libName")).value
        ])
    console.log((<HTMLInputElement>document.getElementById("libName")).value)
}
</script>

<div class="container mx-auto p-8 space-y-8">
    <div class="card card-body space-y-4">
        <TabGroup selected={storeThree} justify="justify-start md:justify-center" borderColor="border-tertiary-500" fill="fill-tertiary-500" color="text-tertiary-500" hover="hover:bg-tertiary-500/10">
            <Tab value="a">
                <svelte:fragment slot="lead">
                    <!-- <SvgIcon name="book" fill="fill-inherit" class="!block" /> -->
                </svelte:fragment>
                General
            </Tab>
            <Tab value="b">
                <svelte:fragment slot="lead">
                    <!-- <SvgIcon name="clapperboard" fill="fill-inherit" class="!block" /> -->
                </svelte:fragment>
                Theme
            </Tab>
            <Tab value="c">
                <svelte:fragment slot="lead">
                    <!-- <SvgIcon name="tv" fill="fill-inherit" class="!block" /> -->
                </svelte:fragment>
                Other
            </Tab>
        </TabGroup>
        <div>
            {#if $storeThree === 'a'}
                <div class="container mx-auto p-8 space-y-8">
                    <div class="card card-body space-y-4">
                        Library Name <input id="libName">
                        <button class="btn variant-filled-primary btn-base" on:click={()=>{saveSettings()}}>Save</button>
                    </div>
                </div>
            {/if}
            {#if $storeThree === 'b'}
                <h3>Themes</h3>
                <p>Nisl nunc mi ipsum faucibus vitae aliquet nec. Ac ut consequat semper viverra nam libero justo laoreet. Nec sagittis aliquam malesuada.</p>
            {/if}
            {#if $storeThree === 'c'}
                <h3>Television</h3>
                <p>Ut sem viverra aliquet eget sit. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Vulputate enim nulla aliquet porttitor.</p>
            {/if}
        </div>
    </div>
</div>