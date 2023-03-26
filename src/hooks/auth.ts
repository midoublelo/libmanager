import { validateUser } from '$lib/db';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export const store: Writable<string> = localStorageStore('loginInfo', 'blank');

export const getUserDetails = async ( username: string, password: string ) => {
    let check = await validateUser(username, password)
    if (check == true) {
        return 1;
    }
}