// node seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const inicializarJugadores = true;
const inicilizarFixture = true;
const rellenarPartidos = true;

// SELECT p.*, f.*, j1.nombre AS e1_j1_nombre, j2.nombre AS e1_j2_nombre, j3.nombre AS e2_j1_nombre, j4.nombre AS e2_j2_nombre, j5.nombre AS descansa_nombre FROM partido p, fixture f, jugador j1, jugador j2, jugador j3, jugador j4, jugador j5 WHERE p.fixtureId=f.id AND f.e1_j1=j1.id AND f.e1_j2=j2.id AND f.e2_j1=j3.id AND f.e2_j2=j4.id AND f.descansa=j5.id
function restarHoras(fechaActual, horasARestar) {
	// Obtener la fecha en milisegundos
	const milisegundos = fechaActual.getTime();
	// Calcular los milisegundos que equivalen a las horas a restar
	const milisegundosARestar = horasARestar * 60 * 60 * 1000;
	// Restar los milisegundos y crear una nueva fecha
	const nuevaFecha = new Date(milisegundos - milisegundosARestar);
	return nuevaFecha;
}

if (inicializarJugadores) {
	await prisma.$queryRaw`
		DELETE FROM jugador where 1=1;
	`;
	await prisma.$queryRaw`
		INSERT INTO jugador (id, nombre) VALUES
		(4, 'Antonio'),
		(5, 'Armando'),
		(1, 'Fernando'),
		(2, 'Jorge'),
		(3, 'Lorenzo');
	`;
}

if (inicilizarFixture) {
	await prisma.$queryRaw`
		DELETE FROM fixture;
	`;
	await prisma.$queryRaw`
		INSERT INTO fixture (id, e1_j1, e1_j2, e2_j1, e2_j2, descansa) VALUES
		(1, 1, 2, 3, 4, 5),
		(2, 1, 3, 2, 4, 5),
		(3, 1, 4, 2, 3, 5),
		(4, 1, 5, 3, 4, 2),
		(5, 1, 3, 4, 5, 2),
		(6, 1, 4, 3, 5, 2),
		(7, 1, 2, 4, 5, 3),
		(8, 1, 4, 2, 5, 3),
		(9, 1, 5, 2, 4, 3),
		(10, 1, 3, 2, 5, 4),
		(11, 1, 2, 3, 5, 4),
		(12, 1, 5, 2, 3, 4),
		(13, 2, 3, 4, 5, 1),
		(14, 2, 4, 3, 5, 1),
		(15, 2, 5, 3, 4, 1);
	`;
}

if (rellenarPartidos) {
	await prisma.$queryRaw`
		DELETE FROM partido;
	`;
	for (let index = 0; index < 4; index++) {
		await prisma.partido.createMany({
			data: [
				{
					fixtureId: 1,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 2,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 3,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 4,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 5,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 6,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 7,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 8,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 9,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 10,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 11,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				},
				{
					fixtureId: 12,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 13,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 14,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 1
				},
				{
					fixtureId: 15,
					fecha: restarHoras(new Date(), 3),
					equipo_ganador: 2
				}
			]
		});
	}
}
