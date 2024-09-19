export function restarHoras(fechaActual: Date, horasARestar: number) {
	// const fechaActual = new Date();
	// Obtener la fecha en milisegundos
	const milisegundos = fechaActual.getTime();
	// Calcular los milisegundos que equivalen a las horas a restar
	const milisegundosARestar = horasARestar * 60 * 60 * 1000;
	// Restar los milisegundos y crear una nueva fecha
	const nuevaFecha = new Date(milisegundos - milisegundosARestar);
	return nuevaFecha;
}
