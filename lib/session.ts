import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET; // openssl rand -base64 32
const encodedKey = new TextEncoder().encode(secretKey);

// Define the JWT payload interface extending the `Record<string, any>` type
interface JWTPayload extends Record<string, unknown> {
	userId: string;
	expiresAt?: number; // milliseconds
}

export async function encrypt(payload: JWTPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		});
		return payload as JWTPayload; // Type assertion to ensure correct type
	} catch (error) {
		console.log('Failed to verify session:', error);
	}
}

// Setting cookies: https://nextjs.org/docs/app/building-your-application/authentication
export async function createSession(userId: string) {
	const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // expires in 7 days
	const session = await encrypt({ userId, expiresAt });

	cookies().set('session', session, {
		httpOnly: true,
		secure: true,
		expires: new Date(expiresAt), // Convert milliseconds to Date
		sameSite: 'lax',
		path: '/',
	});
}

// useful for keeping the user logged in after they access the application again
export async function updateSession() {
	const session = cookies().get('session')?.value;
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // expires in 7 days
	cookies().set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: 'lax',
		path: '/',
	});
}

// useful for logging out the user
export function deleteSession() {
	cookies().delete('session');
}



