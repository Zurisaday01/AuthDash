declare global {
	interface User {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		password: string; // Typically, this would be a hashed password
		lastLogin?: Date;
		registrationTime: Date;
		status: 'active' | 'blocked';
	}

	interface SessionPayload {
		id: string;
		userId: string;
		sessionToken: string;
		createdAt: Date;
		expiresAt?: Date;
		user: User;
	}

	interface ErrorException extends Error {
		code?: string;
	}
}

export {};
