import { verifySession } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const getUser = cache(async () => {
	const session = await verifySession();

	if (!session) return null;

	try {
		const user = await prisma.user.findFirst({ where: { id: session.userId } });

		return user;
	} catch (error) {
		console.log('Failed to fetch user');
		return null;
	}
});

export const getAllUsers = cache(async () => {
	const session = await verifySession();

	if (!session) return null;

	try {
		const users = await prisma.user.findMany();
		

		return users;
	} catch (error) {
		console.log('Failed to fetch users');
		return null;
	}
});

export const updateStatusUsers = async (
	userIds: string[],
	status: 'active' | 'blocked'
) => {
	try {
		// Block multiple users
		await Promise.all(
			userIds.map(userId =>
				prisma.user.update({
					where: { id: userId },
					data: { status: status },
				})
			)
		);

		revalidatePath('/dashboard');
	} catch (error) {
		console.error('Failed to block user(s)', error);
	}
};
