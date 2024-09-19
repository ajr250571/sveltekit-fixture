import prisma from '$lib/prisma';

export const GET = async () => {
	interface Jugadores {
		id: number;
		nombre: string;
		jugados: number;
		ganados: number;
	}
	interface Parejas {
		nombre: string;
		jugados: number;
		ganados: number;
	}
	interface Partidos {
		id: number;
		fixtureId: number;
		fecha: Date;
		equipo1: string;
		equipo2: string;
		descansa: string;
		equipo_ganador: number;
	}
	interface Fixture {
		id: number;
		e1_j1: number;
		e1_j2: number;
		e2_j1: number;
		e2_j2: number;
		descansa: number;
	}
	interface JugadorData {
		id: number;
		nombre: string;
	}
	interface PartidosData {
		id: number;
		fixtureId: number;
		fecha: Date;
		equipo_ganador: number;
	}

	const jugadores: Jugadores[] = [];
	const parejas: Parejas[] = [];
	const partidos: Partidos[] = [];

	let jugadoresData: JugadorData[] = [];
	try {
		jugadoresData = await prisma.jugador.findMany({
			orderBy: {
				id: 'asc'
			}
		});
	} catch (error) {
		console.log(error);
		return Response.json({ error: 'Error al obtener los Jugadores' }, { status: 500 });
	}

	jugadoresData.forEach((jugador) => {
		jugadores.push({
			id: jugador.id,
			nombre: jugador.nombre,
			jugados: 0,
			ganados: 0
		});
	});

	let fixtures: Fixture[] = [];
	try {
		fixtures = await prisma.fixture.findMany({
			orderBy: {
				id: 'asc'
			}
		});
	} catch (error) {
		console.log(error);
		return Response.json({ error: 'Error al obtener los Fixtures' }, { status: 500 });
	}

	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();
	const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
	const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

	let partidosData: PartidosData[] = [];

	try {
		partidosData = await prisma.partido.findMany({
			where: {
				fecha: {
					gte: currentMonthStart,
					lte: currentMonthEnd
				}
			},
			orderBy: {
				id: 'desc'
			}
		});
	} catch (error) {
		console.log(error);
		return Response.json({ error: 'Error al obtener los partidos' }, { status: 500 });
	}

	partidosData.forEach((partido) => {
		// buscar fixture
		const fixture = fixtures.find((fixture) => fixture.id === partido.fixtureId);
		const e1_j1 = fixture?.e1_j1;
		const e1_j2 = fixture?.e1_j2;
		const e2_j1 = fixture?.e2_j1;
		const e2_j2 = fixture?.e2_j2;
		const descansa = fixture?.descansa;

		let equipo1: string = '';
		let equipo2: string = '';
		let descansa_nombre: string = '';

		const e1_j1_nombre = jugadoresData
			.find((jugador) => jugador.id === e1_j1)
			?.nombre.substring(0, 4);
		const e1_j2_nombre = jugadoresData
			.find((jugador) => jugador.id === e1_j2)
			?.nombre.substring(0, 4);
		const e2_j1_nombre = jugadoresData
			.find((jugador) => jugador.id === e2_j1)
			?.nombre.substring(0, 4);
		const e2_j2_nombre = jugadoresData
			.find((jugador) => jugador.id === e2_j2)
			?.nombre.substring(0, 4);

		equipo1 = e1_j1_nombre + '/' + e1_j2_nombre;
		equipo2 = e2_j1_nombre + '/' + e2_j2_nombre;
		descansa_nombre =
			jugadoresData.find((jugador) => jugador.id === descansa)?.nombre.substring(0, 4) ?? '';

		partidos.push({
			id: partido.id,
			fecha: partido.fecha,
			equipo1: equipo1,
			equipo2: equipo2,
			descansa: descansa_nombre,
			equipo_ganador: partido.equipo_ganador,
			fixtureId: partido.fixtureId
		});

		// ranking jugadores
		jugadores.find((jugador) => {
			if (
				jugador.id === e1_j1 ||
				jugador.id === e1_j2 ||
				jugador.id === e2_j1 ||
				jugador.id === e2_j2
			) {
				jugador.jugados += 1;
			}
			if (partido.equipo_ganador === 1) {
				if (jugador.id === e1_j1 || jugador.id === e1_j2) {
					jugador.ganados += 1;
				}
			} else {
				if (jugador.id === e2_j1 || jugador.id === e2_j2) {
					jugador.ganados += 1;
				}
			}
		});
		// ranking parejas

		// pregunto si la pareja existe
		const pareja1Existe = parejas.find((pareja) => {
			return pareja.nombre === equipo1;
		});
		if (pareja1Existe) {
			parejas.find((pareja) => {
				if (pareja.nombre === equipo1) {
					pareja.jugados += 1;
					if (partido.equipo_ganador === 1) {
						pareja.ganados += 1;
					}
				}
			});
		} else {
			if (partido.equipo_ganador === 1) {
				parejas.push({
					nombre: equipo1,
					jugados: 1,
					ganados: 1
				});
			} else {
				parejas.push({
					nombre: equipo1,
					jugados: 1,
					ganados: 0
				});
			}
		}

		const pareja2Existe = parejas.find((pareja) => {
			return pareja.nombre === equipo2;
		});
		if (pareja2Existe) {
			parejas.find((pareja) => {
				if (pareja.nombre === equipo2) {
					pareja.jugados += 1;
					if (partido.equipo_ganador === 1) {
						pareja.ganados += 1;
					}
				}
			});
		} else {
			if (partido.equipo_ganador === 2) {
				parejas.push({
					nombre: equipo2,
					jugados: 1,
					ganados: 1
				});
			} else {
				parejas.push({
					nombre: equipo2,
					jugados: 1,
					ganados: 0
				});
			}
		}
	});

	jugadores.sort((a, b) => b.ganados - a.ganados);
	parejas.sort((a, b) => b.ganados - a.ganados);

	return Response.json({ partidos, parejas, jugadores }, { status: 200 });
};
