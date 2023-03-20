<script lang="ts">
    import { browser } from '$app/environment';
    import { addFees, db, removeFees } from '$lib/db';
    import { createDataTableStore, dataTableHandler, GradientHeading, modalStore, Paginator, ProgressBar, tableInteraction, type ModalSettings } from '@skeletonlabs/skeleton';
	import { Chart } from "chart.js/auto";
    import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';

	// const data = {
	// 	labels: [
	// 		'Books Added',
	// 		'Books Taken Out',
	// 		'Books Added to Stock'
	// 	],
	// 	datasets: [{
	// 		label: 'Test Chart',
	// 		data: [300, 200, 100],
	// 		backgroundColor: [
	// 			'rgb(255, 0, 0)',
	// 			'rgb(0, 255, 0)',
	// 			'rgb(0, 0, 255)'
	// 		],
	// 		hoverOffset: 4
	// 	}]
	// };

	// const chartConfig = {
	// 	type: 'pie',
	// 	data: data
	// }

	// let ctx1;
	// let ctx2;
	// let chart1;
	// let chart2;
	// Chart.defaults.color = '#FFFFFF'

	// onMount(async (promise) => {
	// 	ctx1 = chart1.getContext('2d');
	// 	ctx2 = chart2.getContext('2d');
	// 	var charta1 = new Chart(ctx1, chartConfig)
	// 	var charta2 = new Chart(ctx2, chartConfig)
	// })

	const borrowList = liveQuery(
			async () => browser
				? db.borrows.toArray()
				: []
	);

	let sourceData = [
		{}
	];

	// DOES NOT ACTUALLY WORK, will just pretend it does
	function updateStatus() {
		let todayFormatted = (new Date()).toISOString().split('T')[0];
		for (let i = 0; i < sourceData.length; i++) {
			if (sourceData[i]['returnDate'] > todayFormatted) {
				sourceData[i]['status'] = "In Date"
			} else {
				sourceData[i]['status'] = "Late"
				if ( sourceData[i]['lastChecked'] !== todayFormatted ) {
					let daysDiff = Math.ceil( (new Date(todayFormatted).getTime() - new Date(sourceData[i]['lastChecked']).getTime()) / (1000 * 3600 * 24));
					let lateFees = 0.2 * daysDiff;
					addFees(lateFees, sourceData[i]['user'])
					db.borrows.where("id").equals(sourceData[i]['id']).modify({lastChecked: todayFormatted})
				} else if ( sourceData[i]['lastChecked'] === todayFormatted ) {
					let lateFees = 0.5;
					addFees(lateFees, sourceData[i]['user'])
					db.borrows.where("id").equals(sourceData[i]['id']).modify({lastChecked: todayFormatted})
				}

				// if ( typeof sourceData[i]['lastChecked'] !== "undefined" ) {
				// 	if ( sourceData[i]['lastChecked'] !== todayFormatted ) {
				// 		let daysDiff = Math.ceil( (new Date(todayFormatted).getTime() - new Date(sourceData[i]['lastChecked']).getTime()) / (1000 * 3600 * 24));
				// 		console.log(daysDiff)
				// 	}
				// } else {
				// 	sourceData[i]['lastChecked'] = todayFormatted
				// 	console.log(sourceData[i]['lastChecked'])
				// }
				// sourceData[i]['lateFees'] = lateFees
				// addFees(lateFees, sourceData[i]['user'])
			}
		}
	}

	// DOES NOT ACTUALLY WORK, will just pretend it does
	function confirmDeleteBorrow(borrow) {
		const confirm: ModalSettings = {
			type: 'confirm',
			title: 'Confirm Deletion',
			body: `Are you sure you want to delete ${borrow.user.email}'s borrow of ${borrow.book.title}?`,
			response: (r: boolean) => {
				if (r) {
					if (borrow.status == "Late") {
						let todayFormatted = (new Date()).toISOString().split('T')[0];
						let lateFees = 1.00 + (0.2 * (Math.ceil( (new Date(todayFormatted).getTime() - new Date(borrow.returnDate).getTime()) / (1000 * 3600 * 24))));
						removeFees(lateFees, borrow.user)
					}
					db.borrows.where('id').equals(borrow.id).delete();
				} 
			}
		}
		modalStore.trigger(confirm)
	}

	const borrowTableModel = createDataTableStore(
		sourceData,
		{
			search: '',
			sort: '',
			pagination: { offset: 0, limit: 5, size: 0, amounts: [1, 5, 10, 25] }
		}
	);

	function loadBorrows() {
		if ($borrowList !== undefined) {
			// @ts-ignore
			sourceData = $borrowList;
			updateStatus();
			borrowTableModel.updateSource(sourceData);
		}
	}

	$: console.log("IGNORE ME:", $borrowList), loadBorrows()
	borrowTableModel.subscribe((v) => dataTableHandler(v));
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1>Welcome to Your Library</h1>
	<h2>Books Currently Borrowed</h2>
	<section class="card card-body">
		<div class="card-header">
			<input bind:value={$borrowTableModel.search} type="search" placeholder="Quick Search..." class="mx-auto w-[48rem] space-y-1 placeholder:italic placeholder:ml-[16px]"/>
		</div>
		<div class="card-body">
			{#if $borrowList}
			<div class="table-container">
				<table class="table table-hover" use:tableInteraction>
					<thead on:click={(e) => { borrowTableModel.sort(e) }} on:keypress>
						<tr>
							<th data-sort="book">Book</th>
							<th data-sort="user">User</th>
							<th data-sort="returnDate">Return Date</th>
							<th data-sort="status">Status</th>
							<th class="edit">Modify</th>
							<!-- ... --->
						</tr>
					</thead>
					<tbody>
						{#each $borrowTableModel.filtered as row, rowIndex}
							<tr>
								<td>{row.book?.title}</td>
								<td>{row.user?.email}</td>
								<td>{row.returnDate}</td>
								<td>{row.status}</td>
								<td class="edit">
									<!-- <button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row)}}>View/Edit</button> -->
									<button class="btn btn-ghost-surface btn-sm" on:click={()=>{confirmDeleteBorrow(row)}}>Delete</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<ProgressBar class="h-8 rounded-full"/>
		{/if}
		<div class="card-footer">
			<Paginator bind:settings={$borrowTableModel.pagination} />
		</div>
	</section>
	<!-- <hr />
	<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="space-y-4">
			<label class="label">
				<span>Today's Activity</span>
				<canvas bind:this={chart1} id="myChart" class=" -translate-x-8 translate-y-16"></canvas>
			</label>
		</div>
		<div class="space-y-4">
			<label class="label">
				<span>test</span>
				<canvas bind:this={chart2} id="myChart" class=" -translate-x translate-y-16"></canvas>
			</label>
		</div>
	</div> -->
</div>
