<script lang="ts">
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
	} from '@skeletonlabs/skeleton';
	
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	import AddBookForm from "./AddBookForm.svelte";
	import AddIsbnForm from './AddISBNForm.svelte';

	// import { LowSync } from 'lowdb';
	// import { LocalStorage } from 'lowdb/browser';

	// const adapter = new LocalStorage('db');
	// const db = new LowSync(adapter);

	// db.read()
	// db.data ||= { books: [] }

	// db.data.books.push({ title: 'test' })

	// console.log(db.data)

	// let nothing = {
    //     id: -1,
	// }
	// const booksStore: Writable<string> = localStorageStore('booksStore', JSON.stringify(nothing));
	let sourceData = [
		{}
	];

const dataTableModel = createDataTableStore(
	// Pass your source data here:
	sourceData,
	// Provide optional settings:
	{
		// The current search term.
		search: '',
		// The current sort key.
		sort: '',
		// Paginator component settings.
		pagination: { offset: 0, limit: 5, size: 0, amounts: [1, 5, 10, 25] }
	}
);

function confirmBook(bookData: object): void {
	const id = Object.keys(sourceData).length + 1;
	// @ts-ignore
	bookData["id"] = id;
	const confirm: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you wish to proceed?',
		// confirm = TRUE | cancel = FALSE
		response: (r: boolean) => {
			if (r) {
				let newBook = {
					"id": bookData["id"],
					"title": bookData["title"],
					"author": bookData["author"],
					"genre": bookData["genre"],
					"isbn": "",
					"pubDate": "",
					"pageCount": "",
					"description": "",
					"imageLink": "",
					"publisher": "",
					"language": ""
				}
				// let curBooks = JSON.parse($booksStore)
				// $booksStore = JSON.stringify(curBooks.concat(newBook))
				dataTableModel.updateSource( JSON.parse(lib.queryAll("books")) )
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
			body: 'Enter book details',
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
					confirmBook(book);
				}
			}
		};
	modalStore.trigger(d);
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
			<div class="table-container">
				<table class="table table-hover" use:tableInteraction>
					<thead on:click={(e) => { dataTableModel.sort(e) }} on:keypress>
						<tr>
							<th data-sort="title">Title</th>
							<th data-sort="author">Author</th>
							<th data-sort="genre">Genre</th>
							<th data-sort="pubData">Publication Date</th>
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
								<!-- <td>{row.isbn}</td> -->
								<td class="edit">
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row, rowIndex)}}>Edit</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row, rowIndex)}}>View</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<div class="card-footer">
			<Paginator bind:settings={$dataTableModel.pagination} />
		</div>
	</section>
</div>