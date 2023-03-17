<script lang="ts">
    import { addUser, db, emailCheck } from "$lib/db";
    import { getUserDetails, store } from "../hooks/auth";

    let username = "";
    let password = "";
    let error = "";

    async function login() {
        const user: any = await getUserDetails( username, password )

        if ( user ) {
            $store = user
            if ( error ) error = ""
        } else {
            error = "Incorrect username and password"
        }
    }

    async function signUp() {
        if (emailCheck.test(username) == true ) { // If input is valid email then move onto next check
            const existCheck = await db.users.where( {email: username} ).first(); // Reads users table to see if email is already taken
            if (existCheck == undefined) { // If input is valid email and is unused then add the user and login
                await addUser(username, password, "Staff");
                login()
            } else {
                alert('User with that email already exists')
            }
        }
    }

    function prevAccess() {
        location.reload()
    }
</script>

<form on:submit class="flex flex-col items-center justify-center pt-6 content-center">
    <div class="card w-3/5">
        <header class="card-header"><h1 class="text-center">Login</h1></header>
        <div class="card-body">
            <label for="email">
                <span>Email</span>
                <input type="email" placeholder="email@example.com" bind:value={username}>
            </label>
            <label for="password">
                <span>Password</span>
                <input type="password" placeholder="Password" bind:value={password}>
            </label>
            <div class="grid gap-4 grid-cols-2 grid-rows-1">
                <button type="submit" class="btn bg-primary-500 btn-base text-white mt-4 object-center static right-16 self-center rounded" on:click={login}>Login</button>
                <button type="submit" class="btn bg-primary-500 btn-base text-white mt-4 object-center static right-16 self-center rounded" on:click={signUp}>Sign Up</button>
            </div>
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