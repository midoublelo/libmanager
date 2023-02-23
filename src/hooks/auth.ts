import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

const user = "test@test.com";
const pass = "password";

export const store: Writable<string> = localStorageStore('loginInfo', 'blank');

export const getUserDetails = async ( username: string, password: string ) => {
    if ( username === user && password === pass) {
        return 1;
    }
}