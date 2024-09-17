import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z
		.string()
		.email({ message: 'Please enter a valid email address.' })
		.min(5, {
			message: 'Email must be at least 5 characters long.',
		}),
	password: z.string().min(1, {
		message: 'Password must be at least 1 character long.',
	}),
});

export const registerFormSchema = z
	.object({
		firstName: z.string().min(2, {
			message: 'First name must be at least 2 characters long.',
		}),
		lastName: z.string().min(2, {
			message: 'Last name must be at least 2 characters long.',
		}),
		email: z
			.string()
			.email({ message: 'Please enter a valid email address.' })
			.min(5, {
				message: 'Email must be at least 5 characters long.',
			}),
		password: z.string().min(1, {
			message: 'Password must be at least 1 character long.',
		}),
		confirmPassword: z.string().min(1, {
			message: 'Confirm password must be at least 1 character long.',
		}),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword'],
			});
		}
	});
