import prisma from '$lib/prisma';

export const GET = async () => {
	const result = await prisma.partido.findMany({ take: 100 });
	return Response.json(result, { status: 201 });
};

export const POST = async ({ request }) => {
	const body = await request.json();
	const result = await prisma.partido.create({ data: body });
	return Response.json(result, { status: 201 });
};
