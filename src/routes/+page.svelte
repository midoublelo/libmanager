<script lang="ts">
    import { GradientHeading } from '@skeletonlabs/skeleton';
	import { Chart } from "chart.js/auto";
	import { onMount } from 'svelte';

	const data = {
		labels: [
			'Red',
			'Blue',
			'Yellow'
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

	let ctx;
	let chart1;
	Chart.defaults.color = '#FFFFFF'

	onMount(async (promise) => {
		ctx = chart1.getContext('2d');
		var chart = new Chart(ctx, chartConfig)
	})

</script>

<div class="container mx-auto p-8 space-y-8">
    <GradientHeading tag="h1" direction="bg-gradient-to-br" from="from-primary-500" to="to-accent-500">
        Homepage
    </GradientHeading>
	<p>hello1.</p>
	<hr />
	<section class="card card-body">
		<canvas bind:this={chart1} id="myChart" class="scale-50 -translate-x-32 translate-y-16"></canvas>
	</section>
	<hr />
</div>
