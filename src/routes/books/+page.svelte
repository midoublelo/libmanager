<script lang="ts">
	import * as isbn from 'node-isbn';

	import {
		createDataTableStore,
		dataTableHandler,
		tableInteraction,
		Paginator,
		modalStore,
		menu,
        ProgressBar,
	} from '@skeletonlabs/skeleton';
	
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	import AddBookForm from "./AddBookForm.svelte";
	import AddIsbnForm from './AddISBNForm.svelte';
	import ViewBook from './ViewBook.svelte';

	import { browser } from '$app/environment';
	import { liveQuery } from "dexie";
	import { addBorrow, addItem, db } from "$lib/db";
	import { currentBook } from '$lib/stores';
    import UploadFile from './UploadFile.svelte';
    import BorrowBook from './BorrowBook.svelte';

	const bookList = liveQuery(
		async () => browser
			? db.books.toArray()
			: []
	);

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
		}
	}

	$: console.log("IGNORE ME:", $bookList), loadSource()

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
			response: (r: boolean) => {
				if (r) {
					addItem(
						bookData["id"],
						bookData["title"],
						bookData["author"],
						bookData["genre"],
						bookData["pubDate"],
						bookData["copies"])
					loadSource()
				}
			}
		};
		modalStore.trigger(confirm);
	}

function addBook(): void {
	const c: ModalComponent = { ref: AddBookForm };
		const d: ModalSettings = {
			type: 'component',
			title: 'Add Book',
			body: 'Enter required book details. Additional optional information can be added afterwards.',
			component: c,
			response: (r: any) => {
				if (r) confirmBook(r);
			}
		};
	modalStore.trigger(d);
}

// function addFile(): void {
// 	const c: ModalComponent = { ref: UploadFile };
// 	const d: ModalSettings = {
// 		type: 'component',
// 		title: 'Add Books',
// 		body: 'Upload .csv file to add multiple books at once.',
// 		component: c,
// 		response: (r: any) => {
// 			if (r) console.log(r)
// 		}
// 	}
// 	modalStore.trigger(d);
// }

function getIsbn(isbnCode: any): any {
	try { 
		const bookData = isbn.resolve(isbnCode);
		return bookData;
	} catch(ReferenceError) {
		alert('Connection failed')
	}
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
				book['copies'] = r['copies']
 				if (book.hasOwnProperty('categories') == false || book.categories[0] == undefined || book.categories[0] == null) {
					book.categories = "undefined"
				}
				let rebuiltBook = {
					title: book.title,
					author: book.authors[0],
					genre: book.categories,
					pubDate: book.publishedDate,
					isbn: book.isbn,
					pageCount: book.pageCount,
					description: book.description,
					imageLink: book.imageLinks['smallThumbnail'],
					publisher: book.publisher,
					language: book.language,
					copies: book.copies
				}
				confirmBook(rebuiltBook);
			}
		}
	};
	modalStore.trigger(d);
}

function viewBookData(book) {
	$currentBook = book;
	const c: ModalComponent = { ref: ViewBook };
	const data: ModalSettings = {
		type: 'component',
		component: c,
		title: `Viewing ${book['title']}...`,
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

function borrowBook(book) {
	$currentBook = book;
	const c: ModalComponent = { ref: BorrowBook };
	const data: ModalSettings = {
		type: 'component',
		component: c,
		title: `Borrowing ${book['title']}...`,
		image: book['imageLink'],
		response: (r: any) => {
			let borrowInfo = {
				book: book,
				user: r.user,
				returnDate: r.returnDate
			}
			if (borrowInfo.user !== undefined || borrowInfo.returnDate !== undefined) {
				let todayFormatted = (new Date()).toISOString().split('T')[0];
				addBorrow(borrowInfo.book, borrowInfo.user, borrowInfo.returnDate, todayFormatted)
			}
		}
	};
	modalStore.trigger(data)
}

dataTableModel.subscribe((v) => dataTableHandler(v));
</script>

<div class="container mx-auto p-8 space-y-8">
	<h2>All Books in Database</h2>
	<section class="card card-body">
		<div class="card-header">
			<input bind:value={$dataTableModel.search} type="search" placeholder="Quick Search..." class="mx-auto w-[48rem] space-y-1 placeholder:italic placeholder:ml-[16px]"/>
			<span class="relative">
			<button class="btn btn-ghost-surface btn-sm ml-[60.5px] items-right" use:menu={{ menu: 'navigation' }}>Add Book...</button>
			<nav class="list-nav card p-4 w-40 shadow-xl" data-menu="navigation">
				<ul>
					<li><a href={''} on:click={addBook}>From Input</a></li>
					<li><a href={''} on:click={addISBN}>From ISBN</a></li>
					<!-- <li><a href={''} on:click={addFile}>From File</a></li> -->
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
							<th data-sort="copies">Copies in Stock</th>
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
								<td>{row.copies}</td>
								<td class="edit">
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{borrowBook(row)}}>Borrow</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{viewBookData(row)}}>View/Edit</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{confirmDeleteBook(row)}}>Delete</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{:else}
			<!-- <ProgressRadial stroke={40} meter="stroke-primary-500" value={undefined} class="scale-50 -translate-y-32" /> -->
			<ProgressBar class="h-8 rounded-full"/>
			{/if}
		<div class="card-footer">
			<Paginator bind:settings={$dataTableModel.pagination} />
		</div>
	</section>
</div>