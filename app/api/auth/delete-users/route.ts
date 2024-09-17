import { deleteUsers } from '@/actions/auth.actions';
import { verifySession } from '@/lib/dal';

import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	// User authentication and role verification
	const session = await verifySession();

	if (!session) {
		// User is not authenticated
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await req.json();
		const { userIds, status } = body;

		if (
			!Array.isArray(userIds) ||
			!userIds.every(id => typeof id === 'string')
		) {
			return NextResponse.json(
				{ message: 'Invalid user IDs' },
				{ status: 400 }
			);
		}

		await deleteUsers(userIds);

		return NextResponse.json(
			{
				message: `${
					userIds.length > 1 ? 'Users' : 'User'
				} deleted successfully`,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
	}
}
