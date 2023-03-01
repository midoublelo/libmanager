<script lang="ts">
	// import "fake-indexeddb/auto";
	import * as isbn from 'node-isbn';

	import {
		createDataTableStore,
		dataTableHandler,
		tableInteraction,
		tableA11y,
		Paginator,
		Modal,
		modalStore,
		menu,
        ProgressRadial,
	} from '@skeletonlabs/skeleton';
	
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	import AddBookForm from "./AddBookForm.svelte";
	import AddIsbnForm from './AddISBNForm.svelte';

	import { browser } from '$app/environment';
	import { liveQuery } from "dexie";
	import { addItem, db, wipeDb } from "../../lib/db";
    import { faLanguage } from '@fortawesome/free-solid-svg-icons';

	const bookList = liveQuery(
		async () => browser
			? db.books.toArray()
			: []
	);

	// let query = readDb()
	// console.log(query)
	// console.log($bookList)
	// db.books.where("name").equalsIgnoreCase("testBook").each(friend => {
    //     console.log("Found Josephine", friend);
    // });

	// let nothing = {
    //     id: -1,
	// }
	// const booksStore: Writable<string> = localStorageStore('booksStore', JSON.stringify(nothing));
	let sourceData = [
		{}
	];

const dataTableModel = createDataTableStore(
	sourceData,
	{
		search: '',
		sort: '',
		pagination: { offset: 0, limit: 5, size: 0, amounts: [1, 5, 10, 25] }
	}
);

function loadSource() {
	if ($bookList !== undefined) {
		// @ts-ignore
		sourceData = $bookList;
		dataTableModel.updateSource(sourceData);
		console.log(sourceData)
	}
}
$: console.log($bookList), loadSource()

async function confirmBook(bookData: object) {
	let id;
	if (sourceData.length > 0) {
		const lastInd = sourceData.at(-1);
		// @ts-ignore
		id = lastInd['id'] + 1;
	} else {
		id = 0;
	}
	// @ts-ignore
	bookData["id"] = id;
	const confirm: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you wish to proceed?',
		// confirm = TRUE | cancel = FALSE
		response: (r: boolean) => {
			if (r) {
				addItem(
					bookData["id"],
					bookData["title"],
					bookData["author"],
					bookData["genre"],
					bookData["pubDate"])
				loadSource()
			}
		}
	};
	modalStore.trigger(confirm);
	// dataTableModel.update((v) => dataTableHandler(v));
}

function addBook(): void {
	const c: ModalComponent = { ref: AddBookForm };
		const d: ModalSettings = {
			type: 'component',
			title: 'Add Book',
			body: 'Enter required book details. Additional optional information can be added afterwards.',
			component: c,
			response: (r: any) => {
				// if (r) console.log('response:', r);
				if (r) confirmBook(r);
			}
		};
	modalStore.trigger(d);
}

function getIsbn(isbnCode: any): any { 
	const bookData = isbn.resolve(isbnCode);
	return bookData;
}

function addISBN(): void {
	const c: ModalComponent = { ref: AddIsbnForm };
		const d: ModalSettings = {
			type: 'component',
			title: 'Add Book',
			body: 'Enter ISBN',
			component: c,
			response: async (r: any) => {
				if (r) {
					const book: any = await getIsbn(r['isbn']);
					book['isbn'] = r['isbn'];
					if (book.categories[0] == undefined) {
						book.categories[0] = "undefined"
					}
					let rebuiltBook = {
						title: book.title,
						author: book.authors[0],
						genre: book.categories[0],
						pubDate: book.publishedDate,
						isbn: book.isbn,
						pageCount: book.pageCount,
						description: book.description,
						imageLink: book.imageLinks['smallThumbnail'],
						publisher: book.publisher,
						language: book.language
					}
					console.log(rebuiltBook)
					confirmBook(rebuiltBook);
				}
			}
		};
	modalStore.trigger(d);
}

function viewBookData(book) {
	const bodyText = `
	Title: ${book['title']}
	Author: ${book['author']}
	Genre: ${book['genre']}
	Publication Date: ${book['pubDate']}
	Page Count: ${book['pageCount']}
	Description: ${book['description']}
	Publisher: ${book['publisher']}
	Language: ${book['languge']}`
	console.log(book);
	const data: ModalSettings = {
		type: 'alert',
		title: book['title'],
		body: bodyText,
		image: book['imageLink']
	};
	modalStore.trigger(data)
}

function confirmDeleteBook(book) {
	const confirm: ModalSettings = {
		type: 'confirm',
		title: 'Confirm Deletion',
		body: `Are you sure you want to delete ${book.title}?`,
		response: (r: boolean) => {
			if (r) {
				db.books.where('id').equals(book.id).delete();
				loadSource();
			} 

		}
	}
	modalStore.trigger(confirm)
}

// Automatically handles search, sort, etc when the model updates.
dataTableModel.subscribe((v) => dataTableHandler(v));
</script>

<div class="container mx-auto p-8 space-y-8">
	<section class="card card-body">
		<div class="card-header">
			<input bind:value={$dataTableModel.search} type="search" placeholder="Search Table..." class="mx-auto w-[48rem] space-y-1 placeholder:italic placeholder:ml-[16px]"/>
			<span class="relative">
			<button class="btn btn-ghost-surface btn-sm ml-[60.5px] items-right" use:menu={{ menu: 'navigation' }}>Add Book...</button>
			<nav class="list-nav card p-4 w-40 shadow-xl" data-menu="navigation">
				<ul>
					<li><a href={''} on:click={addISBN}>From ISBN</a></li>
					<li><a href={''} on:click={addBook}>From Input</a></li>
				</ul>
			</nav>
			</span>
		</div>
		<div class="card-body">
			{#if $bookList}
			<div class="table-container">
				<table class="table table-hover" use:tableInteraction>
					<thead on:click={(e) => { dataTableModel.sort(e) }} on:keypress>
						<tr>
							<th data-sort="title">Title</th>
							<th data-sort="author">Author</th>
							<th data-sort="genre">Genre</th>
							<th data-sort="pubData">Publication Date</th>
							<th data-sort="copies">Copies</th>
							<!-- <th data-sort="isbn">ISBN</th> -->
							<th class="edit">Modify</th>
							<!-- ... --->
						</tr>
					</thead>
					<tbody>
						{#each $dataTableModel.filtered as row, rowIndex}
							<tr>
								<td>{row.title}</td>
								<td>{row.author}</td>
								<td>{row.genre}</td>
								<td>{row.pubDate}</td>
								<td></td>
								<!-- <td>{row.isbn}</td> -->
								<td class="edit">
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row, rowIndex)}}>Edit</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{viewBookData(row)}}>View</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{confirmDeleteBook(row)}}>Delete</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{:else}
			<ProgressRadial stroke={40} meter="stroke-primary-500" value={undefined} class="scale-50 -translate-y-32" />
			{/if}
		<div class="card-footer">
			<Paginator bind:settings={$dataTableModel.pagination} />
		</div>
	</section>
</div>