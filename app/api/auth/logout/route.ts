import { verifySession } from '@/lib/dal';
import { deleteSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
	// User authentication and role verification
	const session = await verifySession();

	// Check if the user is authenticated
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Delete session
	await deleteSession();

	return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
