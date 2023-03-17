<script lang="ts">
	import {
		createDataTableStore,
		tableInteraction,
		Paginator,
        ProgressBar,
        dataTableHandler,
		type ModalSettings, 
		type ModalComponent,
        modalStore,
	} from '@skeletonlabs/skeleton';

	import { addUser, db, emailCheck } from "$lib/db";
	import { browser } from '$app/environment';
	import { liveQuery } from "dexie";
    import NewUserForm from './AddUser.svelte';
    import ViewUser from './ViewUser.svelte';
    import { currentUser } from '$lib/stores';

	const users = liveQuery(
			async () => browser
				? db.users.toArray()
				: []
	);

    let sourceData = [
        {}
    ]

	const userTableModel = createDataTableStore(
		sourceData,
		{
			search: '',
			sort: '',
			pagination: { offset: 0, limit: 5, size: 0, amounts: [1, 5, 10, 25] }
		}
	);

	function loadUsers() {
		if ($users !== undefined) {
			// @ts-ignore
			sourceData = $users;
			userTableModel.updateSource(sourceData);
		}
	}

	$: console.log("IGNORE ME:", $users), loadUsers()

    const currency = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    })

	userTableModel.subscribe((v) => dataTableHandler(v));

	function addNewUser() {
		const c: ModalComponent = { ref: NewUserForm };
		const d: ModalSettings = {
			type: 'component',
			title: 'Add User',
			body: 'Enter new user details',
			component: c,
			response: async (r: any) => {
				if (r) {
					if (r !== undefined && emailCheck.test(r['email']) == true) {
						addUser(r['email'], null, "Customer")
					} else {
						alert("Invalid email")
					}
				}
			}
		}
		modalStore.trigger(d)
	}

	function viewEditUser(user) {
		$currentUser = user;
		console.log(user)
		const c: ModalComponent = { ref: ViewUser };
		const d: ModalSettings = {
			type: 'component',
			title: `Viewing ${user['email']}`,
			component: c
		}
		modalStore.trigger(d);
	}

</script>

<div class="container mx-auto p-8 space-y-8">
	<h2>All Registered Users</h2>
	<section class="card card-body">
		<div class="card-header">
			<input bind:value={$userTableModel.search} type="search" placeholder="Search Users..." class="mx-auto w-[48rem] space-y-1 placeholder:italic placeholder:ml-[16px]"/>
			<span class="relative">
				<button class="btn btn-ghost-surface btn-sm ml-[60.5px] items-right" on:click={()=>{addNewUser()}}>Add User...</button>
			</span>
		</div>
		<div class="card-body">
			{#if $users}
			<div class="table-container">
				<table class="table table-hover" use:tableInteraction>
					<thead on:click={(e) => { userTableModel.sort(e) }} on:keypress>
						<tr>
							<th data-sort="type">Type</th>
							<th data-sort="email">Email</th>
							<th data-sort="fees">Current Fees</th>
							<th class="edit">Modify</th>
							<!-- ... --->
						</tr>
					</thead>
					<tbody>
						{#each $userTableModel.filtered as row, rowIndex}
							<tr>
								<td>{row.type}</td>
								<td>{row.email}</td>
								<td>{currency.format(row.currentFee)}</td>
								<td class="edit">
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{viewEditUser(row)}}>View/Edit</button>
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