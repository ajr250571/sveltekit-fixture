import prisma from '$lib/prisma';

export const GET = async () => {
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
		jugado?: number;
	}

	const jugadores = await prisma.jugador.findMany({
		orderBy: {
			id: 'asc'
		}
	});

	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();
	const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
	const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

	const partidosPorFixture = await prisma.partido.groupBy({
		by: ['fixtureId'],
		where: {
			fecha: {
				gte: currentMonthStart,
				lte: currentMonthEnd
			}
		},
		orderBy: {
			fixtureId: 'asc'
		},
		_count: {
			id: true
		}
	});

	const fixtures: Fixtures[] = [];
	const fixtureActual: Fixtures[] = await prisma.fixture.findMany();

	fixtureActual.forEach(async (partido) => {
		const partidos_jugados = partidosPorFixture.find((item) => item.fixtureId === partido.id)
			?._count.id;
		let equipo1: string = '';
		let equipo2: string = '';
		let descansa_nombre: string = '';
		equipo1 =
			jugadores.find((jugador) => jugador.id === partido.e1_j1)?.nombre.substring(0, 4) + '/';
		equipo1 += jugadores.find((jugador) => jugador.id === partido.e1_j2)?.nombre.substring(0, 4);
		equipo2 =
			jugadores.find((jugador) => jugador.id === partido.e2_j1)?.nombre.substring(0, 4) + '/';
		equipo2 += jugadores.find((jugador) => jugador.id === partido.e2_j2)?.nombre.substring(0, 4);
		descansa_nombre =
			jugadores.find((jugador) => jugador.id === partido.descansa)?.nombre.substring(0, 4) ?? '';
		fixtures.push({
			id: partido.id,
			e1_j1: partido.e1_j1,
			e1_j2: partido.e1_j2,
			e2_j1: partido.e2_j1,
			e2_j2: partido.e2_j2,
			descansa: partido.descansa,
			equipo1: equipo1,
			equipo2: equipo2,
			descansa_nombre: descansa_nombre,
			jugado: partidos_jugados ?? 0
		});
	});

	fixtures.forEach(async (partido) => {
		const partidos = await prisma.partido.findMany({
			where: {
				fixtureId: partido.id
			}
		});
		partido.jugado = partidos.length ?? 0;

		jugadores.filter(async (jugador) => {
			if (jugador.id === partido.e1_j1) {
				partido.equipo1 = jugador.nombre.substring(0, 3) + '/';
			}
			if (jugador.id === partido.e1_j2) {
				partido.equipo1 += jugador.nombre.substring(0, 3);
			}
			if (jugador.id === partido.e2_j1) {
				partido.equipo2 = jugador.nombre.substring(0, 3) + '/';
			}
			if (jugador.id === partido.e2_j2) {
				partido.equipo2 += jugador.nombre.substring(0, 3);
			}
			if (jugador.id === partido.descansa) {
				partido.descansa_nombre = jugador.nombre.substring(0, 3);
			}
		});
	});

	return Response.json(fixtures, { status: 201 });
};
