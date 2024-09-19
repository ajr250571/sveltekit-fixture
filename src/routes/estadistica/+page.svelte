<script lang="ts">
	// import axios from 'axios';
	import { onMount } from 'svelte';

	interface Datos {
		partidos: Partido[];
		parejas: Pareja[];
		jugadores: Jugador[];
	}

	interface Jugador {
		id?: number;
		nombre: string;
		jugados: number;
		ganados: number;
	}
	interface Pareja {
		id?: number;
		nombre: string;
		jugados: number;
		ganados: number;
	}
	interface Partido {
		id: number;
		fecha: Date;
		equipo1: string;
		equipo2: string;
		descansa: string;
		equipo_ganador: number;
		fixtureId: number;
	}

	let datos: Datos;
	let partidosView: Partido[] = [];

	onMount(async () => {
		let headersList = {
			Accept: '*/*',
			'User-Agent': 'Thunder Client (https://www.thunderclient.com)'
		};

		datos = await fetch('/api/estadistica', {
			method: 'GET',
			headers: headersList
		}).then((res) => res.json());

		// console.log(datos);
		partidosView = datos.partidos.slice(0, 30);

		//const { data, status } = await axios.get('/api/estadistica');
		//if (status !== 200) {
		//	console.log(data);
		//} else {
		//	datos = data;
		//	partidosView = data.partidos.slice(0, 30);
		//}
	});
</script>

<div class="items-center justify-center px-2 mt-4">
	{#if datos}
		<h2 class="text-2xl mt-2">Ranking Jugadores</h2>
		<div class="grid grid-cols-10 gap-y-3 mt-4 ml-4">
			<div class="col-span-1 bbw font-bold text-sm text-center">ID</div>
			<div class="col-span-3 bbw font-bold text-sm">Jugador</div>
			<div class="col-span-3 bbw font-bold text-sm text-center">Jugados</div>
			<div class="col-span-3 bbw font-bold text-sm text-center">Ganados</div>
			{#if datos.jugadores}
				{#each datos.jugadores as jugador}
					<div class="col-span-1 bbw text-center text-sm">{jugador.id}</div>
					<div class="col-span-3 bbw text-sm">{jugador.nombre}</div>
					<div class="col-span-3 bbw text-sm text-center">{jugador.jugados}</div>
					<div class="col-span-3 bbw text-sm text-center">{jugador.ganados}</div>
				{/each}
			{/if}
		</div>
		<h2 class="text-2xl mt-2">Ranking Parejas</h2>
		<div class="grid grid-cols-9 gap-y-3 mt-4 ml-4">
			<div class="col-span-3 bbw font-bold text-sm">Pareja</div>
			<div class="col-span-3 bbw font-bold text-sm text-center">Jugados</div>
			<div class="col-span-3 bbw font-bold text-sm text-center">Ganados</div>
			{#if datos.parejas}
				{#each datos.parejas as pareja}
					<div class="col-span-3 bbw text-sm">{pareja.nombre}</div>
					<div class="col-span-3 bbw text-sm text-center">{pareja.jugados}</div>
					<div class="col-span-3 bbw text-sm text-center">{pareja.ganados}</div>
				{/each}
			{/if}
		</div>

		<!-- 
		<h2 class="text-2xl mt-2">Partidos Jugados (Ultimos 30)</h2>
		<div class="grid grid-cols-10 gap-y-0.5 mt-2 ml-4">
			<div class="col-span-1 font-bold text-sm bbw text-center">Par.</div>
			<div class="col-span-1 font-bold text-sm bbw text-center">Fix.</div>
			<div class="col-span-3 font-bold text-sm bbw text-center">Equipo 1</div>
			<div class="col-span-3 font-bold text-sm bbw text-center">Equipo 2</div>
			<div class="col-span-2 font-bold text-sm bbw text-center">Des.</div>
			{#if partidosView}
				{#each partidosView as partido}
					<div class="col-span-1 text-sm bbw text-center">{partido.id}</div>
					<div class="col-span-1 text-sm bbw text-center">{partido.fixtureId}</div>
					{#if partido.equipo_ganador === 1}
						<div class="col-span-3 text-sm font-bold bbw text-black bg-green-300 text-center">
							{partido.equipo1}
						</div>
						<div class="col-span-3 text-sm bbw text-black bg-red-300 text-center">
							{partido.equipo2}
						</div>
					{:else}
						<div class="col-span-3 text-sm bbw text-black bg-red-300 text-center">
							{partido.equipo1}
						</div>
						<div class="col-span-3 text-sm font-bold bbw text-black bg-green-300 text-center">
							{partido.equipo2}
						</div>
					{/if}
					<div class="col-span-2 text-sm bbw text-center">{partido.descansa}</div>
				{/each}
			{/if}
		</div> 
		-->
	{/if}
</div>

<style>
	.bbw {
		border-bottom: 2px solid rgb(231, 226, 226, 0.2);
	}
</style>
