<script lang="ts">
    // @ts-nocheck
    import { modalStore } from "@skeletonlabs/skeleton";

    //import { currentBook } from "./+page.svelte"

    // export let parent: any;

    import { currentBook } from "$lib/stores";
    import { updateItem } from "$lib/db";

    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cImage = 'max-w-[90%] max-h-[90%] rounded-container-token overflow-hidden shadow-xl';

    function updateBookDetails() {
        let newBook = {
            title: document.getElementById("title").value ? document.getElementById("title").value : $currentBook['title'],
            author: document.getElementById("author").value ? document.getElementById("author").value : $currentBook['author'],
            genre: document.getElementById("genre").value ? document.getElementById("genre").value : $currentBook['genre'],
            pubDate: document.getElementById("pubDate").value ? document.getElementById("pubDate").value : $currentBook['pubDate'],
            pageCount: document.getElementById("pageCount").value ? document.getElementById("pageCount").value : $currentBook['pageCount'],
            description: document.getElementById("description").value ? document.getElementById("description").value : $currentBook['description'],
            publisher: document.getElementById("publisher").value ? document.getElementById("publisher").value : $currentBook['publisher'],
            language: document.getElementById("language").value ? document.getElementById("language").value : $currentBook['language'],
            copies: document.getElementById("copies").value ? document.getElementById("copies").value : $currentBook['copies']
        };
        updateItem(newBook, $currentBook);
        modalStore.close();
    }
</script>

<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    {#if $currentBook['imageLink']}
        <img src={$currentBook['imageLink']} class={cImage} alt="Thumbnail" />
    {/if}
    <div class="space-y-4">
        <label class="label">
            <span>Title</span>
            <input class="input" id="title" type="text" placeholder={$currentBook['title']} />
        </label>
        <label class="label">
            <span>Genre</span>
            <input class="input" id="genre" type="text" placeholder={$currentBook['genre']} />
        </label>
        <label class="label">
            <span>Page Count</span>
            <input class="input" id="pageCount" type="text" placeholder={$currentBook['pageCount']} />
        </label>
        <label class="label">
            <span>Publisher</span>
            <input class="input" id="publisher" type="text" placeholder={$currentBook['publisher']} />
        </label>
    </div>
    <div class="space-y-4">
        <label class="label">
            <span>Author</span>
            <input class="input" id="author" type="text" placeholder={$currentBook['author']} />
        </label>
        <label class="label">
            <span>Publication Date</span>
            <input class="input" id="pubDate" type="text" placeholder={$currentBook['pubDate']} />
        </label>
        <label class="label">
            <span>Description</span>
            <input class="input" id="description" type="text" placeholder={$currentBook['description']} />
        </label>
        <label class="label">
            <span>Language</span>
            <input class="input" id="language" type="text" placeholder={$currentBook['language']} />
        </label>
    </div>
    <hr />
    <div>
        <label class="label">
            <span>Copies</span>
            <input class="input" id="copies" type="text" placeholder={$currentBook['copies']} />
        </label>
        <button class="btn variant-filled-primary" on:click={()=>{updateBookDetails()}}>Update</button>
    </div>
</div>