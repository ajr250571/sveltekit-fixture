<script lang="ts">
	import { toast } from 'svelte-sonner';
	import axios from 'axios';
	import { restarHoras } from '$lib/functions.js';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	// export let data;
	interface Fixtures {
		id: number;
		e1_j1: number;
		e1_j2: number;
		e2_j1: number;
		e2_j2: number;
		descansa: number;
		equipo1?: string;
		equipo2?: string;
		descansa_nombre?: string;
		jugado: number;
		chequeado?: boolean;
	}

	let fixtures: Fixtures[] = [];
	onMount(async () => {
		fixtures = (await axios.get(`/api/fixture`)).data;
	});

	const handleClick = async (id: number, equipo_ganador: number) => {
		let nombre_equipo_ganador = '';
		let fixtureId = fixtures[id - 1].id ?? 0;
		if (equipo_ganador === 1) {
			nombre_equipo_ganador = fixtures[id - 1].equipo1 ?? '';
		} else {
			nombre_equipo_ganador = fixtures[id - 1].equipo2 ?? '';
		}

		Swal.fire({
			title: 'Confirma partido ' + fixtureId + ' (' + nombre_equipo_ganador + ') ganador ?',
			showDenyButton: false,
			showCancelButton: true,
			confirmButtonText: 'OK'
		}).then(async (result) => {
			if (result.isConfirmed) {
				fixtures[id - 1].jugado = (fixtures[id - 1].jugado ?? 0) + 1;
				const response = await axios.post('/api/partido', {
					fixtureId: id,
					equipo_ganador: equipo_ganador,
					fecha: restarHoras(new Date(), 3)
				});
				if (response.status === 201) {
					toast.success('Grabado Exitosamente!', { position: 'top-right' });
					fixtures[id - 1].chequeado = false;
				}
			}
		});
	};
	let maximo = 0;
	$: {
		maximo = fixtures.reduce((acc, curr) => Math.max(acc, curr.jugado ?? 0), -Infinity);
	}
</script>

<h2 class="text-2xl mt-2">Carga Partidos</h2>
<div class="grid grid-cols-12 gap-x-1 gap-y-3 mt-4 px-2">
	<div class="col-span-3 font-bold text-md">Partido</div>
	<div class="col-span-3 font-bold text-md text-center">Equipo 1</div>
	<div class="col-span-3 font-bold text-md text-center">Equipo 2</div>
	<div class="col-span-2 font-bold text-md text-center">Des.</div>
	<div class="div col-span-1 font-bold text-md text-center">Jug.</div>
	{#each fixtures as fixture}
		<div class="col-span-3 text-md flex text-center">
			<input
				type="checkbox"
				checked={fixture.chequeado}
				on:click={() => (fixture.chequeado = !fixture.chequeado)}
				class="checkbox checkbox-info checkbox-lg mr-4"
			/>
			<p>{fixture.id}</p>
		</div>
		<button
			class="col-span-3 btn btn-secondary btn-sm text-center"
			style="background-color: {fixture.chequeado ? 'green' : 'purple'}; 
			color: {fixture.chequeado ? 'black' : 'white'}"
			on:click={() => handleClick(fixture.id, 1)}
			disabled={!fixture.chequeado}
			>{fixture.equipo1}
		</button>
		<button
			class="col-span-3 btn btn-secondary btn-sm text-center"
			style="background-color: {fixture.chequeado ? 'green' : 'purple'}; 
			color: {fixture.chequeado ? 'black' : 'white'}"
			on:click={() => handleClick(fixture.id, 2)}
			disabled={!fixture.chequeado}
			>{fixture.equipo2}
		</button>
		{#if fixture.descansa % 2 == 0}
			<div class="col-span-2 btn btn-sm btn-primary text-center">{fixture.descansa_nombre}</div>
		{:else}
			<div class="col-span-2 btn btn-sm btn-info text-center">{fixture.descansa_nombre}</div>
		{/if}
		{#if fixture?.jugado < maximo}
			<div class="col-span-1 text-lg font-bold text-center btn btn-warning btn-sm">
				{fixture.jugado}
			</div>
		{:else}
			<div class="col-span-1 text-lg font-bold text-center">{fixture.jugado}</div>
		{/if}
	{/each}
</div>
