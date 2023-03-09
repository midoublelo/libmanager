<script lang="ts">
    import { GradientHeading } from '@skeletonlabs/skeleton';
	import { Chart } from "chart.js/auto";
	import { onMount } from 'svelte';

	const data = {
		labels: [
			'Books Added',
			'Books Taken Out',
			'Books Added to Stock'
		],
		datasets: [{
			label: 'Test Chart',
			data: [300, 200, 100],
			backgroundColor: [
				'rgb(255, 0, 0)',
				'rgb(0, 255, 0)',
				'rgb(0, 0, 255)'
			],
			hoverOffset: 4
		}]
	};

	const chartConfig = {
		type: 'pie',
		data: data
	}

	let ctx1;
	let ctx2;
	let chart1;
	let chart2;
	Chart.defaults.color = '#FFFFFF'

	onMount(async (promise) => {
		ctx1 = chart1.getContext('2d');
		ctx2 = chart2.getContext('2d');
		var charta1 = new Chart(ctx1, chartConfig)
		var charta2 = new Chart(ctx2, chartConfig)
	})

</script>

<div class="container mx-auto p-8 space-y-8">
    <GradientHeading tag="h1" direction="bg-gradient-to-br" from="from-primary-500" to="to-accent-500">
        Welcome to Your Library
    </GradientHeading>
	<p>...</p>
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
