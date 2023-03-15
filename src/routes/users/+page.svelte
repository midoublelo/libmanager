<script lang="ts">
	import {
		createDataTableStore,
		dataTableHandler,
		tableInteraction,
		tableA11y,
		Paginator,
		Modal,
		modalStore,
		menu,
        ProgressBar
	} from '@skeletonlabs/skeleton';

	import { db } from "$lib/db";
	import { browser } from '$app/environment';
	import { liveQuery } from "dexie";

    let sourceData = [
        {}
    ]

const userTableModel = createDataTableStore(
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

	const users = liveQuery(() => db.users.toArray());
	async function loadUsers() {
		console.log($users)
	}

$: console.log(sourceData), loadUsers()
</script>

<div class="container mx-auto p-8 space-y-8">
	<section class="card card-body">
		<div class="card-header">
			<input bind:value={$userTableModel.search} type="search" placeholder="Search Users..." class="mx-auto w-[48rem] space-y-1 placeholder:italic placeholder:ml-[16px]"/>
		</div>
		<div class="card-body">
			{#if $users}
			<div class="table-container">
				<table class="table table-hover" use:tableInteraction>
					<thead on:click={(e) => { userTableModel.sort(e) }} on:keypress>
						<tr>
							<th data-sort="id">ID</th>
							<th data-sort="email">Email</th>
							<th class="edit">Modify</th>
							<!-- ... --->
						</tr>
					</thead>
					<tbody>
						{#each $userTableModel.filtered as row, rowIndex}
							<tr>
								<td>{row.id}</td>
								<td>{row.email}</td>
								<td class="edit">
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row,rowIndex)}}>Edit</button>
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row,rowIndex)}}>View</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{:else}
			<ProgressBar class="h-8 rounded-full"/>
			{/if}
		</div>
		<div class="card-footer">
			<Paginator bind:settings={$userTableModel.pagination} />
		</div>
	</section>
</div>