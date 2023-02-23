<script lang="ts">
    import { getUserDetails } from "../hooks/auth";
    import { store } from "../hooks/auth";

    let username = "";
    let password = "";
    let error = "";

    async function login() {
        const user: any = await getUserDetails( username, password )

        if ( user ) {
            console.log(user)
            $store = user
            if ( error ) error = ""
        }
        else {
            error = "Incorrect username and password"
            console.log(error)
            console.log(username, password)
        }
    }

    function prevAccess() {
        location.reload()
    }
</script>

<form on:submit|preventDefault={login} class="flex flex-col items-center justify-center pt-6 content-center">
    <div class="card w-3/5">
        <header class="card-header"><h1 class="px-56">Login</h1></header>
        <div class="card-body">
            <label for="email">
                <span>Email</span>
                <input type="email" placeholder="email@example.com" bind:value={username}>
            </label>
            <label for="password">
                <span>Password</span>
                <input type="password" placeholder="Password" bind:value={password}>
            </label>
            <button type="submit" class="btn bg-primary-500 btn-base text-white mt-4 object-center static right-16 self-center rounded">Login</button>
        </div>
        <footer class="card-footer">
            <small class="text-danger">{error}</small>
        </footer>
    </div>
</form>

<!-- !!! -->
<!-- TODO: Prevent user from navigating to other page -->
<!-- !!! -->

<!-- <svelte:window on:beforeunload={prevAccess}></svelte:window> -->