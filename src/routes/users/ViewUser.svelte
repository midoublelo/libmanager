<script lang="ts">
    // @ts-nocheck
    import { currentUser } from "$lib/stores";
    import { updateUser } from "$lib/db";

   	import { modalStore } from "@skeletonlabs/skeleton";

    const currency = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    })

    function updateUserDetails() {
        let newUser = {
            currentFee: document.getElementById("currentFees").value ? document.getElementById("currentFees").value : $currentUser['currentFee']
        }
        updateUser(newUser, $currentUser);
        modalStore.close();
    }
</script>


<div class="p-4">
    <div class="space-y-4">
        <label class="label">
            <span>Current Fees</span>
            <input class="input" id="currentFees" type="text" placeholder={currency.format($currentUser['currentFee'])} />
        </label>
    </div>
    <hr />
    <div>
        <button class="btn variant-filled-primary" on:click={()=>{updateUserDetails()}}>Update</button>
    </div>
</div>