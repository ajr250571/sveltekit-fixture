<script lang="ts">
	import { onMount } from 'svelte';

	/* 
	function formatearFecha(fecha: Date) {
		const meses = [
			'Ene',
			'Feb',
			'Mar',
			'Abr',
			'May',
			'Jun',
			'Jul',
			'Ago',
			'Sep',
			'Oct',
			'Nov',
			'Dic'
		];
		return meses[fecha.getMonth()] + ' ' + fecha.getFullYear();
	} 
	*/

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

	interface Datos {
		partidos: Partido[];
		parejas: Pareja[];
		jugadores: Jugador[];
	}

	let datos: Datos;
	let partidosView: Partido[] = [];

	const inicio = 0;
	const fin = 15;

	onMount(async () => {
		datos = await fetch(`/api/estadistica?inicio=${inicio}&fin=${fin}`).then((res) => res.json());
		partidosView = datos.partidos;
	});
</script>

<svelte:head>
	<title>Metegol</title>
</svelte:head>

<div class="flex flex-col items-center justify-center mt-2">
	<h1 class="text-5xl font-bold">Metegol</h1>

	{#if datos?.partidos?.length > 0}
		<div class="stats stats-vertical">
			<div class="stat">
				<div class="stat-title">1er Puesto Jugador</div>
				<div class="stat-value">{datos.jugadores[0].nombre}</div>
			</div>

			<div class="stat">
				<div class="stat-title">1er Puesto Pareja</div>
				<div class="stat-value">{datos.parejas[0].nombre}</div>
			</div>

			<div class="stat">
				<div class="stat-title">Partidos Jugados (Ultimos {fin})</div>
				<div class="stat-value">
					<div class="grid grid-cols-10 gap-y-0.5 mt-1">
						{#each partidosView as partido}
							<p class="col-span-2 text-sm p-1 bg-gray-100 text-black text-center">{partido.id}</p>
							{#if partido.equipo_ganador === 1}
								<div class="col-span-3 text-sm font-bold text-black bg-green-300 text-center p-1">
									{partido.equipo1}
								</div>
								<div class="col-span-3 text-sm text-black bg-red-300 text-center p-1">
									{partido.equipo2}
								</div>
							{:else}
								<div class="col-span-3 text-sm text-black bg-red-300 text-center p-1">
									{partido.equipo1}
								</div>
								<div class="col-span-3 text-sm font-bold text-black bg-green-300 text-center p-1">
									{partido.equipo2}
								</div>
							{/if}
							<p class="col-span-2 text-sm p-1 bg-gray-100 text-black text-center">
								{partido.fecha.toString().substr(8, 2) +
									' ' +
									partido.fecha.toString().substr(11, 5)}
							</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<h1 class="text-2xl font-bold mt-20 opacity-50">No hay Partidos Jugados ...</h1>
	{/if}
</div>
