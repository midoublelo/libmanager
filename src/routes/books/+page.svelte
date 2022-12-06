<script lang="ts">
	// import isbn = require('node-isbn');
	// import isbn from 'node-isbn';
	import * as isbn from 'node-isbn';

	import {
		type DataTableModel,
		dataTableHandler,
		dataTableSelect,
		dataTableSelectAll,
		dataTableSort,
		tableInteraction,
		tableA11y,
		Paginator,
		Modal,
		modalStore,
		menu
	} from '@skeletonlabs/skeleton';
	
	import type { ModalSettings, ModalComponent} from '@skeletonlabs/skeleton';

    import { writable, type Writable } from 'svelte/store';
	import AddBookForm from "./AddBookForm.svelte";
	import AddIsbnForm from './AddISBNForm.svelte';

    let sourceData = [
        { id: 0, title: 'testTitle', author: "testAuthor", genre: 'testGenre', isbn:"testIsbn" },
    ]

const dataTableModel: Writable<DataTableModel> = writable({
	// The original unfiltered source data.
	source: sourceData,
	// The filtered source data, shown in UI.
	filtered: sourceData,
	// Optional: An array of selected row objects.
	selection: [],
	// Optional: The current search term.
	search: '',
	// Optional: The current sort key.
	sort: '',
	// Optional: The Paginator component settings.
	pagination: { offset: 0, limit: 10, size: 0, amounts: [1, 5, 10, 25] }

});

function confirmBook(bookData: object): void {
	console.log(bookData)
	const id = Object.keys(sourceData).length;
	const bookObj: any = {
		id: id,
		// @ts-ignore
		title: bookData['title'],
		// @ts-ignore
		author: bookData['authors'],
		// @ts-ignore
		genre: bookData['categories'],
		// @ts-ignore
		isbn: bookData['isbn']
	}
	console.log(bookObj);
	const confirm: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you wish to proceed?',
		// confirm = TRUE | cancel = FALSE
		response: (r: boolean) => {
			if (r) sourceData.push(bookObj);
		}
	};
	modalStore.trigger(confirm);
	console.log(sourceData);
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
				if (r) console.log('response:', r);
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
					<thead on:click={(e) => { dataTableSort(e, dataTableModel) }} on:keypress>
						<tr>
							<th data-sort="id">ID</th>
							<th data-sort="name">Title</th>
							<th data-sort="symbol">Author</th>
							<th data-sort="weight">Genre</th>
							<!-- <th data-sort="isbn">ISBN</th> -->
							<th class="edit">Modify</th>
							<!-- ... --->
						</tr>
					</thead>
					<tbody>
						{#each $dataTableModel.filtered as row, rowIndex}
							<tr>
								<td>{row.id}</td>
								<td>{row.title}</td>
								<td>{row.author}</td>
								<td>{row.genre}</td>
								<!-- <td>{row.isbn}</td> -->
								<td class="edit">
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row,rowIndex)}}>Edit</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row,rowIndex)}}>View</button>
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