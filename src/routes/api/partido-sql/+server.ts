import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const partidos = await prisma.$queryRaw`
		select * from partido;
	`;
	return Response.json(partidos, { status: 201 });
};
