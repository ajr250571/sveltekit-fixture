<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';

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

	function formatearHora(fecha: Date) {
		const dia = fecha.getDate().toString().padStart(2, '0'); // Aseguramos dos dígitos para el día
		const hora = fecha.getHours().toString().padStart(2, '0'); // Aseguramos dos dígitos para la hora
		const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Aseguramos dos dígitos para los minutos

		return `${dia} ${hora}:${minutos}`;
	}

	// Ejemplo de uso:
	const fecha = new Date();
	const fechaFormateada = formatearFecha(fecha);

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

	const partidosMostrados = 15;

	onMount(async () => {
		let headersList = {
			Accept: '*/*',
			'User-Agent': 'Thunder Client (https://www.thunderclient.com)'
		};

		datos = await fetch('/api/estadistica', {
			method: 'GET',
			headers: headersList
		}).then((res) => res.json());

		// datos = (await axios.get('/api/estadistica')).data;
		// console.log(datos);
		partidosView = datos.partidos.slice(0, partidosMostrados);
	});
</script>

<svelte:head>
	<title>Metegol</title>
</svelte:head>

<div class="flex flex-col items-center justify-center mt-2">
	<h1 class="text-4xl font-bold mb-2">
		Metegol <span class="text-info text-3xl">{formatearFecha(new Date())}</span>
	</h1>

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
				<div class="stat-title">Partidos Jugados (Ultimos {partidosMostrados})</div>
				<div class="stat-value">
					<div class="grid grid-cols-4 gap-y-0.5 mt-1">
						{#each partidosView as partido}
							<p class="text-sm p-1 bg-secondary text-black text-center">{partido.id}</p>
							{#if partido.equipo_ganador === 1}
								<div class="text-sm font-bold text-black bg-green-300 text-center p-1">
									{partido.equipo1}
								</div>
								<div class="text-sm text-black bg-red-300 text-center p-1">
									{partido.equipo2}
								</div>
							{:else}
								<div class="text-sm text-black bg-red-300 text-center p-1">
									{partido.equipo1}
								</div>
								<div class="text-sm font-bold text-black bg-green-300 text-center p-1">
									{partido.equipo2}
								</div>
							{/if}
							<p class="text-sm p-1 bg-secondary text-black text-center">
								{partido.fecha.toString().substr(8, 2) +
									' ' +
									partido.fecha.toString().substr(11, 5)}
							</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
