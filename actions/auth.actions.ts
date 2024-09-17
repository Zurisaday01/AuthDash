'use server';

import { verifySession } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import { loginFormSchema, registerFormSchema } from '@/schemas';
import bcrypt from 'bcrypt';

export async function login(formData: FormData) {
	try {
		// Validate form fields
		const validatedFields = loginFormSchema.safeParse({
			email: formData.get('email'),
			password: formData.get('password'),
		});

		// If any form fields are invalid, return early
		if (!validatedFields.success) {
			return {
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		// 2. Prepare data
		const { email, password } = validatedFields.data;

		// 3. Find the user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		// If user doesn't exist or password doesn't match
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return { message: 'Invalid email or password' };
		}

		// If the user is blocked, the user cannot login
		if (user.status === 'blocked') {
			return { message: 'Your account has been blocked. You cannot login.' };
		}

		// 4. Update lastLogin
		await prisma.user.update({
			where: { id: user.id },
			data: { lastLogin: new Date() },
		});

		// 5. Create user session
		await createSession(user.id);
	} catch (error: unknown) {
		// Handle any unexpected errors
		console.error('Login error:', error);
		return { message: 'An unexpected error occurred. Please try again later.' };
	}
}

export async function signup(formData: FormData) {
	// Validate form fields
	const validatedFields = registerFormSchema.safeParse({
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		email: formData.get('email'),
		password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword'),
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	// 2. Prepare data for insertion into database
	const { firstName, lastName, email, password } = validatedFields.data;
	// e.g. Hash the user's password before storing it
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		// 3. Insert the user into the database
		await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: hashedPassword,
			},
		});
	} catch (error: unknown) {
		// Handle unique constraint violation
		if ((error as ErrorException).code === 'P2002') {
			return {
				message: 'Email is already registered.',
			};
		}

		// Handle any other errors
		return {
			message:
				'An error occurred while creating your account. Please try again later.',
		};
	}
}

export const deleteUsers = async (userIds: string[]) => {
	try {
		// Verify the session to get the current user
		const session = await verifySession();

		// Check if the session is valid and contains user information
		if (!session || !session.userId) {
			throw new Error('Session verification failed or user ID is missing');
		}

		// Delete multiple users
		await prisma.user.deleteMany({
			where: {
				id: {
					in: userIds,
				},
			},
		});

		// If the current user is deleted, log them out
		if (userIds.includes(session.userId)) {
			// Ensure deleteSession is awaited if it's asynchronous
			await deleteSession();
		}
	} catch (error) {
		console.error('Failed to delete user(s)', error);
	}
};
