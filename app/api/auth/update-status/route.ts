import { updateStatusUsers } from '@/actions/user.actions';
import { verifySession } from '@/lib/dal';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	// User authentication and role verification
	const session = await verifySession();

	// Check if the user is authenticated
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

		await updateStatusUsers(userIds, status);

		return NextResponse.json(
			{
				message: `${userIds.length > 1 ? 'Users' : 'User'}  ${
					status === 'active' ? 'unblocked' : 'blocked'
				} successfully`,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Failed to change status' },
			{ status: 500 }
		);
	}
}
